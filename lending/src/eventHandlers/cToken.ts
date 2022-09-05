import prisma from "../prisma";
import { Config } from "../config";
import { getTimestamp, updateMarket } from "../utils/helper";
import { brotliCompress } from "zlib";
import { cTOKEN_DECIMALS, cTOKEN_DECIMALS_PD, ONE_PD, ZERO_PD } from "../utils/consts";
import { Prisma } from "@prisma/client";
import { time } from "console";

export async function handleBorrow(log: any) {
  console.log("cToken", "Borrow", parseInt(log.blockNumber, 16), log.transactionHash);
  console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  console.log(event);

	let address = log.address;
  let blockNumber = parseInt(log.blockNumber);
  let accountId = event.args.account;
	let accountBorrows = event.args.accountBorrows;
	let borrowAmount = event.args.borrowAmount;
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

	if (market !== null) {
		let marketId = market.id;
		let borrowIndex = market.borrowIndex;

		// c token
		let cTokenStatId = (marketId).concat("-").concat(accountId);
		let cTokenStats = await prisma.accountCToken.update({
			where: {
				id: cTokenStatId
			},
			data: {
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
	}
}

export async function handleRepayBorrow(log: any) {
  console.log("cToken", "RepayBorrow", parseInt(log.blockNumber, 16), log.transactionHash);
  console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  console.log(event);

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

	if (market !== null) {
		let blockNumber = log.blockNumber;
		let txHash = log.transactionHash;
		let accountId = event.args.borrower;
		let accountBorrows = event.args.accountBorrows;
		let repayAmount = event.args.repayAmount;
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
	}
}

export async function handleLiquidateBorrow(log: any) {
  console.log("cToken", "LiquidateBorrow", parseInt(log.blockNumber, 16), log.transactionHash);
  console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  console.log(event);

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
  console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  console.log(event);

	let marketId = log.address;
	let blockNumber = log.blockNumber;
	let timestamp = await getTimestamp(blockNumber);
	await updateMarket(marketId, blockNumber, timestamp);
}

export async function handleNewReserveFactor(log: any) {
  console.log("cToken", "NewReserveFactor", parseInt(log.blockNumber, 16), log.transactionHash);
  console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  console.log(event);

	let marketId = log.address;
	let reserveFactor = event.args.newReserveFactorMantissa;

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
  console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  console.log(event);

	let marketId = log.address;
	let blockNumber = log.blockNumber;
	let amount = event.args.amount;

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
		return;
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
		let cTokenStats = await prisma.accountCToken.update({
			where: {
				id: fromCTokenStatsId
			},
			data: {
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
		let cTokenStats = await prisma.accountCToken.update({
			where: {
				id: toCTokenStatsId
			},
			data: {
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
  console.log(log);
  const event = Config.canto.contracts.cToken.interface.parseLog(log);
  console.log(event);

	let marketId = log.address;
	let newInterestRateModel = event.args.newInterestRateModel;

	// todo: mods: removed create
	await prisma.market.update({
		where: {
			id: marketId
		},
		data: {
			interestRateModelAddress: newInterestRateModel
		}
	})
}
