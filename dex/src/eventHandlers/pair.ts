import { providers } from "ethers" ;
import { ethers } from "ethers";
import prisma from "../prisma";
import {Prisma } from '@prisma/client'
import provider from "../provider";
import config from "../config";
import { Decimal } from "@prisma/client/runtime";
import {
  fetchTokenDecimals,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
} from "../utils/token";
import { getBlockTimestamp, createUser, convertTokenToDecimal, isCompleteMint, createLiquidityPosition, createLiquiditySnapshot } from "../utils/helpers";
import { getEthPriceInUSD, findEthPerToken, getTrackedLiquidityUSD } from "../utils/pricing";
import BaseV1Pair from "../../abis/BaseV1Pair.json";


import { ADDRESS_ZERO,ZERO_BD, BI_18 } from "../utils/contants";
import { eventNames } from "process";
import { privateDecrypt } from "crypto";
import { LogDescription } from "ethers/lib/utils";
import { TokenDefinition } from "../utils/tokenDefinition";

export async function handleTransfer(log: providers.Log) {
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);

  // ignore inital transfers for first adds
  if (event.args.to == ADDRESS_ZERO && event.args.amount == 1000) {
    return;
  }

  // user stats
  createUser(event.args.from)
  createUser(event.args.to)

  // load pair
  let pair = await prisma.pair.findFirstOrThrow({where: { id: ethers.utils.getAddress(log.address)}})
  const pairContract = new ethers.Contract(ethers.utils.getAddress(log.address), BaseV1Pair, provider)

  // liquidity token amount being transfered
  let value = await convertTokenToDecimal(event.args.amount, BI_18)

  // load transaction
  let transaction = await prisma.transaction.upsert({
    where: {
      id: log.transactionHash,
    },
    update: {},
    create: {
      id: log.transactionHash,
      blockNumber: BigInt(log.blockNumber),
      timestamp: await getBlockTimestamp(log.blockNumber),
    },
    include: {
      mints: true,
      burns: true
    }
  });

  // mints
  let mints = transaction.mints;
  if (event.args.from == ADDRESS_ZERO) {
    
    // update total supply
    pair = await prisma.pair.update({
      where: {
        id: ethers.utils.getAddress(log.address)
      },
      data: {
        totalSupply: {increment: value}
      }
    })

    // create new mint if no mints so far OR if last one completed
    if (mints.length === 0 || (await isCompleteMint(mints[mints.length - 1].id))) {
      await prisma.mint.create({
        data: {
          id: `${log.transactionHash}-${mints.length}`,
          transactionId: transaction.id,
          pairId: pair.id,
          to: event.args.to,
          liquidity: value,
          timestamp: transaction.timestamp
        }
      }) 
    }
  }

  // case: direct send first on ETH withdrawls
  if (pair.id == event.args.to) {
    await prisma.burn.create({
      data: {
        id: `${log.transactionHash}-${transaction.burns.length}`,
        transactionId: transaction.id,
        pairId: pair.id,
        liquidity: value,
        timestamp: transaction.timestamp,
        to: event.args.to,
        sender: event.args.sender,
        needsComplete: true
      }
    })
  }

  // burn
  if (event.args.to == ADDRESS_ZERO && event.args.from == pair.id) {
    
    // update pair total supply
    pair = await prisma.pair.update({
      where: {
        id:  ethers.utils.getAddress(log.address) 
      },
      data: {
        totalSupply: {decrement: value}
      }
    })

    // new instance of logical burn
    transaction = await prisma.transaction.findFirstOrThrow({
      where: {
        id: log.transactionHash,
      },
      include: {
        mints: true,
        burns: true
      }
    })
    let burns = transaction.burns;
    // let burn: 
    if (burns.length > 0) {
      const currentBurn = await prisma.burn.findFirstOrThrow({where: { id: burns[burns.length - 1].id }})

    // TODO: fix this
    //   if (currentBurn.needsComplete) {
    //     burn = currentBurn;
    //   } else {
    //     burn = {
    //       id: `${log.transactionHash}-${transaction.burns.length}`,
    //       transactionId: transaction.id,
    //       pairId: pair.id,
    //       liquidity: new Prisma.Decimal(value),
    //       timestamp: transaction.timestamp,
    //       needsComplete: false
    //     }
    //   }
        
    // } else {
    //   burn = {
    //     id: `${log.transactionHash}-${transaction.burns.length}`,
    //     transactionId: transaction.id,
    //     pairId: pair.id,
    //     liquidity: new Prisma.Decimal(value),
    //     timestamp: transaction.timestamp,
    //     needsComplete: false
    //   }
    // }

    // if this logical burn included a fee mint, account for this
    // if (
    //   mints.length !== 0 &&
    //   !(await isCompleteMint(mints[mints.length - 1].id))
    // ) {

    //   let mint = await prisma.mint.findFirstOrThrow({where: {id: mints[mints.length - 1].id}})
    //   burn.feeTo = mint.to;
    //   burn.feeLiquidity = mint.liquidity;

    //   // remove logical mint
    //   await prisma.mint.delete({where: {id: mints[mints.length - 1].id}});
    // }
    // burn = await prisma.burn.create({data: burn})
    }
  }

  if (event.args.from != ADDRESS_ZERO && event.args.from != pair.id) {
    
    let fromUserLiquidityPosition = await createLiquidityPosition(
       ethers.utils.getAddress(log.address),
      event.args.from
    );

    fromUserLiquidityPosition = await prisma.liquidityPosition.update({
      where: {
        id: fromUserLiquidityPosition.id
      },
      data: {
        liquidityTokenBalance: await convertTokenToDecimal(await pairContract.balanceOf(event.args.from), BI_18)
      }
    });
    await createLiquiditySnapshot(fromUserLiquidityPosition, log);
  }

  if (event.args.to != ADDRESS_ZERO && event.args.to != pair.id) {
    let toUserLiquidityPosition = await createLiquidityPosition(
       ethers.utils.getAddress(log.address),
      event.args.to
    );
    toUserLiquidityPosition = await prisma.liquidityPosition.update({
      where: {
        id: toUserLiquidityPosition.id
      },
      data: {
        liquidityTokenBalance: await convertTokenToDecimal(await pairContract.balanceOf(event.args.to), BI_18)
      }
    });
    await createLiquiditySnapshot(toUserLiquidityPosition, log);
  }
}

export async function handleSync(log: any) {
  // console.log("sync")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log)
  const factoryAddress = config.canto.contracts.baseV1Factory.addresses[0];

  // load pair
  let pair = await prisma.pair.findFirstOrThrow({where: { id: ethers.utils.getAddress(log.address)}})
  
  // reset factory liquiuty by subtracting only tracked liquidity
  await prisma.stableswapFactory.update({
    where: {
      id: factoryAddress
    },
    data: {
      totalLiquidityETH: {decrement: pair.trackedReserveETH}
    }
  })

  // reset token total liquidity amount
  let token0 = await prisma.token.update({
    where: {id: pair.token0Id},
    data: {totalLiquidity: {decrement: pair.reserve0}}
  })
  let token1 = await prisma.token.update({
    where: {id: pair.token0Id},
    data: {totalLiquidity: {decrement: pair.reserve0}}
  })

  let pairUpdate: Prisma.PairUpdateInput = {
    reserve0: await convertTokenToDecimal(event.args.reserve0, Number(token0.decimals)),
    reserve1: await convertTokenToDecimal(event.args.reserve1, Number(token1.decimals))
  }

  if (pair.reserve1 != ZERO_BD) {
    pair.token0Price = pair.reserve0.div(pair.reserve1);
  } else {
    pair.token0Price = ZERO_BD;
  }

  if (pair.reserve0 != ZERO_BD) {
    pair.token1Price = pair.reserve1.div(pair.reserve0);
  } else {
    pair.token1Price = ZERO_BD;
  }
  pair = await prisma.pair.update({where: {id: ethers.utils.getAddress(log.address)}, data: pairUpdate})

  // update ETH price now that reserves could have changed
  let bundle = await prisma.bundle.update({
    where: {id: '1'},
    data: {ethPrice: await getEthPriceInUSD()}
  })

  // update derived ETH values
  token0 = await prisma.token.update({
    where: {id: token0.id},
    data: {derivedETH: await findEthPerToken(token0)}
  })

  token1 = await prisma.token.update({
    where: {id: token1.id},
    data: {derivedETH: await findEthPerToken(token1)}
  })
  
  // get tracked liquidity - will be 0 if neither in whitelist
  let trackedLiquidityETH: Decimal;
  let trackedLiquidityUSD = await getTrackedLiquidityUSD(
    pair.reserve0,
    token0,
    pair.reserve1,
    token1
  );
  if (!bundle.ethPrice.equals(ZERO_BD)) {
    // trackedLiquidityNOTE = trackedLiquidityUSD.div(bundle.ethPrice);
    trackedLiquidityETH = trackedLiquidityUSD;
  } else {
    // trackedLiquidityNOTE = ZERO_BD;
    trackedLiquidityETH = trackedLiquidityUSD;
  }

  pair = await prisma.pair.update({
    where: {id: pair.id},
    data: {
      trackedReserveETH: trackedLiquidityETH,
      reserveETH: pair.reserve0.times(token0.derivedETH).plus(pair.reserve1.times(token1.derivedETH)),
      // reserveUSD: pair.reserveUSD.times(bundle.ethPrice)
      reserveUSD: pair.reserveUSD
    }
  })

  // use tracked amounts globally
  let factory = await prisma.stableswapFactory.update({
    where: {
      id: config.canto.contracts.baseV1Factory.addresses[0]
    },
    data: {
      totalLiquidityETH: {increment: trackedLiquidityETH},
    }
  })
  await prisma.stableswapFactory.update({
    where: {
      id: config.canto.contracts.baseV1Factory.addresses[0]
    },
    data: {
      // totalLiquidityUSD: factory.totalLiquidityETH.times(bundle.ethPrice),
      totalLiquidityUSD: factory.totalLiquidityETH,
    }
  })

  // correctly set liquidity amounts for each token
  await prisma.token.update({
    where: {id: token0.id},
    data: {totalLiquidity: {increment: pair.reserve0}}
  })
  await prisma.token.update({
    where: {id: token0.id},
    data: {totalLiquidity: {increment: pair.reserve0}}
  })
}

export async function handleMint(log: providers.Log) {
  // console.log("mint")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
}

export async function handleBurn(log: any) {
  // console.log("burn")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
}

export async function handleSwap(log: any) {
  // console.log("swap")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
}
