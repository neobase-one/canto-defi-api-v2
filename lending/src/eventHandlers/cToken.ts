import prisma from "../prisma";
import { Config } from "../config";
import { createMarket, getTimestamp, updateMarket } from "../utils/helper";
import { cTOKEN_DECIMALS, cTOKEN_DECIMALS_PD, ONE_PD, ZERO_PD } from "../utils/consts";
import { Prisma } from "@prisma/client";

export async function handleBorrow(log: any) {
  console.log("cToken", "Borrow", parseInt(log.blockNumber, 16), log.transactionHash);
  // console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  // console.log(event);

	let address = log.address;
  let blockNumber = new Prisma.Decimal(parseInt(log.blockNumber, 16));
  let accountId = event.args.borrower;
	let accountBorrows = event.args.accountBorrows.toString();
	let borrowAmount = event.args.borrowAmount.toString();
  let txHash = log.transactionHash;
  let timestamp = await getTimestamp(blockNumber);

	let market = await prisma.market.findUnique({
    where: { id: address },
    select: {
      id: true,
      symbol: true,
			borrowIndex: true
    }
  });

	if (market == null) {
    market = await createMarket(address);
  }

	if (market !== null) {
		let marketId = market.id;
		let marketSymbol = market.symbol;
		let borrowIndex = market.borrowIndex;

		// c token
		let cTokenStatId = (marketId).concat("-").concat(accountId);
		let cTokenStats = await prisma.accountCToken.upsert({
			where: {
				id: cTokenStatId
			},
			update: {
				transactionHashes: {
					push: txHash
				},
				transactionTimes: {
					push: timestamp
				},
				accrualBlockNumber: blockNumber,
				storedBorrowBalance: accountBorrows,
				accountBorrowIndex: borrowIndex,
				totalUnderlyingBorrowed: {
					increment: borrowAmount
				}
			},
			create: {
				id: cTokenStatId,
				account: accountId,
				market: marketId,
				symbol: marketSymbol,
				transactionHashes: [txHash],
				transactionTimes: [timestamp],
				accrualBlockNumber: blockNumber,
				storedBorrowBalance: accountBorrows,
				accountBorrowIndex: borrowIndex,
				totalUnderlyingBorrowed: borrowAmount
			}
		})

		// account
		let account = await prisma.account.upsert({
			where: {
				id: accountId
			},
			update: {
				hasBorrowed: true
			},
			create: {
				id: accountId,
				hasBorrowed: true
			}
		})

		// market
		let previousBorrow = cTokenStats.storedBorrowBalance;
		if (previousBorrow.equals(ZERO_PD) && !accountBorrows.equals(ZERO_PD)) {
			await prisma.market.update({
				where: {
					id: marketId
				},
				data: {
					numberOfBorrowers: {
						increment: ONE_PD
					}
				}
			})
		}
	} else {
    console.log(address);
  }
}

export async function handleRepayBorrow(log: any) {
  console.log("cToken", "RepayBorrow", parseInt(log.blockNumber, 16), log.transactionHash);
  // console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  // console.log(event);

	let marketId = log.address;
	let market = await prisma.market.findUnique({
		where: {
			id: marketId
		},
		select: {
			id: true,
			borrowIndex: true,
			symbol: true
		}
	});

	if (market == null) {
    market = await createMarket(marketId);
  }

	if (market !== null) {
		let blockNumber = new Prisma.Decimal(parseInt(log.blockNumber, 16));
		let txHash = log.transactionHash;
		let accountId = event.args.borrower;
		let accountBorrows = event.args.accountBorrows.toString();
		let repayAmount = event.args.repayAmount.toString();
		let accountBorrowIndex = market.borrowIndex;
		let marketSymbol = market.symbol;
		let timestamp = await getTimestamp(blockNumber);
		let cTokenStatsId = marketId.concat('-').concat(accountId)

		// account c token
		let cTokenStats = await prisma.accountCToken.upsert({
			where: {
				id: cTokenStatsId
			},
			update: {
				transactionHashes: {
					push: txHash
				},
				transactionTimes: {
					push: timestamp
				},
				accrualBlockNumber: blockNumber,
				storedBorrowBalance: accountBorrows,
				accountBorrowIndex: accountBorrowIndex,
				totalUnderlyingRepaid: {
					increment: repayAmount
				}
			},
			create: {
				id: cTokenStatsId,
				account: accountId,
				market: marketId,
				symbol: marketSymbol,
				transactionHashes: [txHash],
				transactionTimes: [timestamp],
				accrualBlockNumber: blockNumber,
				storedBorrowBalance: accountBorrows,
				accountBorrowIndex: accountBorrowIndex,
				totalUnderlyingRepaid: repayAmount
			}
		})

		// account
		await prisma.account.upsert({
			where: {
				id: accountId
			},
			update: {},
			create: {
				id: accountId
			}
		})

		// market
		let storedBorrowBalance = cTokenStats.storedBorrowBalance;
		if (storedBorrowBalance.equals(ZERO_PD)) {
			await prisma.market.update({
				where: {
					id: marketId
				},
				data: {
					numberOfBorrowers: {
						decrement: ONE_PD
					}
				}
			})
		}
	} else {
    console.log(marketId);
  }
}

export async function handleLiquidateBorrow(log: any) {
  console.log("cToken", "LiquidateBorrow", parseInt(log.blockNumber, 16), log.transactionHash);
  // console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  // console.log(event);

	// liquidator account
	let liquidatorId = event.args.liquidator;
	await prisma.account.update({
		where: {
			id: liquidatorId
		},
		data: {
			countLiquidator: {
				increment: ONE_PD
			}
		}
	})

	// borrower account
	let borrowerId = event.args.borrower;
	await prisma.account.update({
		where: {
			id: borrowerId
		},
		data: {
			countLiquidated: {
				increment: ONE_PD
			}
		}
	})


}

export async function handleAccrueInterest(log: any) {
  console.log("cToken", "AccrueInterest", parseInt(log.blockNumber, 16), log.transactionHash);
  // console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  // console.log(event);

	let marketId = log.address;
	let blockNumber = new Prisma.Decimal(parseInt(log.blockNumber, 16));
	let timestamp = await getTimestamp(blockNumber);
	await updateMarket(marketId, blockNumber, timestamp);
}

export async function handleNewReserveFactor(log: any) {
  console.log("cToken", "NewReserveFactor", parseInt(log.blockNumber, 16), log.transactionHash);
  // console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  // console.log(event);

	let marketId = log.address;
	let reserveFactor = event.args.newReserveFactorMantissa.toString();

	await prisma.market.update({
		where: {
			id: marketId
		},
		data: {
			reserveFactor: reserveFactor
		}
	})
}

export async function handleTransfer(log: any) {
  console.log("cToken", "Transfer", parseInt(log.blockNumber, 16), log.transactionHash);
  // console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  // console.log(event);

	let marketId = log.address;
	let blockNumber = new Prisma.Decimal(parseInt(log.blockNumber, 16));
	let amount = event.args.amount.toString();

	// market
	let market = await prisma.market.findUnique({
		where: {
			id: marketId
		},
		select: {
			accrualBlockNumber: true,
			exchangeRate: true,
			underlyingDecimals: true,
			symbol: true
		}
	})

	if (market == null) {
    market = await createMarket(marketId);
  }

	let accrualBlockNumber = market.accrualBlockNumber;

	if (accrualBlockNumber !== blockNumber) {
		let timestamp = await getTimestamp(blockNumber);
		market = await updateMarket(marketId, blockNumber, timestamp);
	}

	let txHash = log.transactionHash;
	let timestamp = await getTimestamp(blockNumber);

	let marketSymbol = market.symbol;
	let exchangeRate = market.exchangeRate;
  let amountUnderlying = exchangeRate.times(amount);
  let marketUnderlyingDecimals = market.underlyingDecimals.toNumber();
  let amountUnderylingTruncated = amountUnderlying.toDecimalPlaces(marketUnderlyingDecimals);
	let amountDiv = amount.div(cTOKEN_DECIMALS_PD)
	let cTokenAmount = amountDiv.toDecimalPlaces(cTOKEN_DECIMALS)
	
	// from account c token
	let fromAccountId = event.args.from;
	if (fromAccountId != marketId) {
		// upsert account
		await prisma.account.upsert({
			where: {
				id: fromAccountId
			},
			update: {},
			create: {
				id: fromAccountId,
			}
		})

		// update c account token
		let fromCTokenStatsId = marketId.concat('-').concat(fromAccountId)
		let cTokenStats = await prisma.accountCToken.upsert({
			where: {
				id: fromCTokenStatsId
			},
			update: {
				transactionHashes: {
					push: txHash
				},
				transactionTimes: {
					push: timestamp
				},
				accrualBlockNumber: blockNumber,
				cTokenBalance: {
					decrement: cTokenAmount
				},
				totalUnderlyingRedeemed: {
					increment: amountUnderylingTruncated
				},
			},
			create: {
				id: fromCTokenStatsId,
				account: fromAccountId,
				market: marketId,
				symbol: marketSymbol,
				transactionHashes: [txHash],
				transactionTimes: [timestamp],
				accrualBlockNumber: blockNumber,
				cTokenBalance: 0, // todo: or -cTokenAmount
				totalUnderlyingRedeemed: amountUnderylingTruncated,
			}
		})

		// update market
		let cTokenBalance = cTokenStats.cTokenBalance;
		if (cTokenBalance.equals(ZERO_PD)) {
			await prisma.market.update({
				where: {
					id: marketId,
				},
				data: {
					numberOfSuppliers: {
						decrement: ONE_PD
					}
				}
			})
		}

	}

	// to account
	let toAccountId = event.args.to;
	if (toAccountId != marketId) {
		// upsert account
		await prisma.account.upsert({
			where: {
				id: toAccountId
			},
			update: {},
			create: {
				id: toAccountId,
			}
		})

		// update account c token
		let toCTokenStatsId = marketId.concat('-').concat(toAccountId)
		let cTokenStats = await prisma.accountCToken.upsert({
			where: {
				id: toCTokenStatsId
			},
			update: {
				transactionHashes: {
					push: txHash
				},
				transactionTimes: {
					push: timestamp
				},
				accrualBlockNumber: blockNumber,
				cTokenBalance: {
					increment: cTokenAmount
				},
				totalUnderlyingRedeemed: {
					increment: amountUnderylingTruncated
				},
			},
			create: {
				id: toCTokenStatsId,
				account: fromAccountId,
				market: marketId,
				symbol: marketSymbol,
				transactionHashes: [txHash],
				transactionTimes: [timestamp],
				accrualBlockNumber: blockNumber,
				cTokenBalance: cTokenAmount,
				totalUnderlyingRedeemed: amountUnderylingTruncated,
			}
		})

		// update market
		let cTokenBalance = cTokenStats.cTokenBalance;
		if (cTokenBalance.equals(ZERO_PD) && !amount.equals(ZERO_PD)) {
			await prisma.market.update({
				where: {
					id: marketId,
				},
				data: {
					numberOfSuppliers: {
						increment: ONE_PD
					}
				}
			})
		}
	}
}

export async function handleNewMarketInterestRateModel(log: any) {
  console.log("cToken", "NewMarketInterestRateModel", parseInt(log.blockNumber, 16), log.transactionHash);
  // console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  // console.log(event);

	let marketId = log.address;
	let newInterestRateModel = event.args.newInterestRateModel;

	let market = await prisma.market.findUnique({
    where: {
      id: marketId
    }
  });

  if (market == null) {
    await createMarket(marketId);
  }

	await prisma.market.update({
		where: {
			id: marketId
		},
		data: {
			interestRateModelAddress: newInterestRateModel
		}
	})
}
