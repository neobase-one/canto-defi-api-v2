import { providers } from "ethers";
import { ethers } from "ethers";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import provider from "../provider";
import config from "../config";
import { Decimal } from "@prisma/client/runtime";
import {
  getBlockTimestamp,
  createUser,
  convertTokenToDecimal,
  isCompleteMint,
  createLiquidityPosition,
  createLiquiditySnapshot,
} from "../utils/helpers";
import {
  updateFactoryDayData,
  updatePairDayData,
  updatePairHourData,
  updateTokenDayData,
} from "../utils/dayUpdates";

import {
  getEthPriceInUSD,
  findEthPerToken,
  getTrackedLiquidityUSD,
  getTrackedVolumeUSD,
} from "../utils/pricing";
import BaseV1Pair from "../../abis/BaseV1Pair.json";

import { ADDRESS_ZERO, ZERO_BD, BI_18 } from "../utils/contants";

export async function handleTransfer(log: providers.Log) {
  console.log(`parsing: [transfer] ${log.transactionHash}`);
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);

  // ignore inital transfers for first adds
  if (event.args.to == ADDRESS_ZERO && event.args.amount == 1000) {
    return;
  }

  // user stats
  createUser(event.args.from);
  createUser(event.args.to);

  // load pair
  let pair = await prisma.pair.findFirstOrThrow({
    where: { id: ethers.utils.getAddress(log.address) },
  });
  const pairContract = new ethers.Contract(
    ethers.utils.getAddress(log.address),
    BaseV1Pair,
    provider
  );

  // liquidity token amount being transfered
  let value = await convertTokenToDecimal(event.args.amount, BI_18);

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
      burns: true,
    },
  });

  // mints
  let mints = transaction.mints;
  if (event.args.from == ADDRESS_ZERO) {
    // update total supply
    pair = await prisma.pair.update({
      where: {
        id: ethers.utils.getAddress(log.address),
      },
      data: {
        totalSupply: { increment: value },
      },
    });

    // create new mint if no mints so far OR if last one completed
    if (
      mints.length === 0 ||
      (await isCompleteMint(mints[mints.length - 1].id))
    ) {
      await prisma.mint.create({
        data: {
          id: `${log.transactionHash}-${mints.length}`,
          transactionId: transaction.id,
          pairId: pair.id,
          to: event.args.to,
          liquidity: value,
          timestamp: transaction.timestamp,
        },
      });
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
        sender: event.args.from,
        needsComplete: true,
      },
    });
  }

  // burn
  if (event.args.to == ADDRESS_ZERO && event.args.from == pair.id) {
    // update pair total supply
    pair = await prisma.pair.update({
      where: {
        id: ethers.utils.getAddress(log.address),
      },
      data: {
        totalSupply: { decrement: value },
      },
    });

    // new instance of logical burn
    transaction = await prisma.transaction.findFirstOrThrow({
      where: {
        id: log.transactionHash,
      },
      include: {
        mints: true,
        burns: true,
      },
    });
    let burns = transaction.burns;

    if (burns.length > 0) {
      const currentBurn = await prisma.burn.findFirstOrThrow({
        where: { id: burns[burns.length - 1].id },
      });

      if (!currentBurn.needsComplete) {
        await prisma.burn.create({
          data: {
            id: `${log.transactionHash}-${transaction.burns.length}`,
            transactionId: transaction.id,
            pairId: pair.id,
            liquidity: new Prisma.Decimal(value),
            timestamp: transaction.timestamp,
            needsComplete: false,
          },
        });
      }
    } else {
      await prisma.burn.create({
        data: {
          id: `${log.transactionHash}-${transaction.burns.length}`,
          transactionId: transaction.id,
          pairId: pair.id,
          liquidity: new Prisma.Decimal(value),
          timestamp: transaction.timestamp,
          needsComplete: false,
        },
      });
    }

    // if this logical burn included a fee mint, account for this
    if (
      mints.length !== 0 &&
      !(await isCompleteMint(mints[mints.length - 1].id))
    ) {
      let mint = await prisma.mint.findFirstOrThrow({
        where: { id: mints[mints.length - 1].id },
      });
      await prisma.burn.update({
        where: { id: `${log.transactionHash}-${transaction.burns.length}` },
        data: {
          feeTo: mint.to,
          feeLiquidity: mint.liquidity,
        },
      });
      // remove logical mint
      await prisma.mint.delete({ where: { id: mints[mints.length - 1].id } });
    }
  }

  if (event.args.from != ADDRESS_ZERO && event.args.from != pair.id) {
    let fromUserLiquidityPosition = await createLiquidityPosition(
      ethers.utils.getAddress(log.address),
      event.args.from
    );

    fromUserLiquidityPosition = await prisma.liquidityPosition.update({
      where: {
        id: fromUserLiquidityPosition.id,
      },
      data: {
        liquidityTokenBalance: await convertTokenToDecimal(
          await pairContract.balanceOf(event.args.from),
          BI_18
        ),
      },
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
        id: toUserLiquidityPosition.id,
      },
      data: {
        liquidityTokenBalance: await convertTokenToDecimal(
          await pairContract.balanceOf(event.args.to),
          BI_18
        ),
      },
    });
    await createLiquiditySnapshot(toUserLiquidityPosition, log);
  }
}

export async function handleSync(log: any) {
  console.log(`parsing: [sync] ${log.transactionHash}`);
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
  const factoryAddress = config.canto.contracts.baseV1Factory.addresses[0];

  // load pair
  let pair = await prisma.pair.findFirstOrThrow({
    where: { id: ethers.utils.getAddress(log.address) },
  });

  // reset factory liquiuty by subtracting only tracked liquidity
  await prisma.stableswapFactory.update({
    where: {
      id: factoryAddress,
    },
    data: {
      totalLiquidityETH: { decrement: pair.trackedReserveETH },
    },
  });

  // reset token total liquidity amount
  let token0 = await prisma.token.update({
    where: { id: pair.token0Id },
    data: { totalLiquidity: { decrement: pair.reserve0 } },
  });
  let token1 = await prisma.token.update({
    where: { id: pair.token0Id },
    data: { totalLiquidity: { decrement: pair.reserve0 } },
  });

  let pairUpdate: Prisma.PairUpdateInput = {
    reserve0: await convertTokenToDecimal(
      event.args.reserve0,
      Number(token0.decimals)
    ),
    reserve1: await convertTokenToDecimal(
      event.args.reserve1,
      Number(token1.decimals)
    ),
  };

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
  pair = await prisma.pair.update({
    where: { id: ethers.utils.getAddress(log.address) },
    data: pairUpdate,
  });

  // update ETH price now that reserves could have changed
  let bundle = await prisma.bundle.update({
    where: { id: "1" },
    data: { ethPrice: await getEthPriceInUSD() },
  });

  // update derived ETH values
  token0 = await prisma.token.update({
    where: { id: token0.id },
    data: { derivedETH: await findEthPerToken(token0) },
  });

  token1 = await prisma.token.update({
    where: { id: token1.id },
    data: { derivedETH: await findEthPerToken(token1) },
  });

  // get tracked liquidity - will be 0 if neither in whitelist
  let trackedLiquidityETH: Decimal;
  let trackedLiquidityUSD = await getTrackedLiquidityUSD(
    pair.reserve0,
    token0,
    pair.reserve1,
    token1
  );
  if (!bundle.ethPrice.equals(ZERO_BD)) {
    // trackedLiquidityETH = trackedLiquidityUSD.div(bundle.ethPrice);
    trackedLiquidityETH = trackedLiquidityUSD;
  } else {
    // trackedLiquidityETH = ZERO_BD;
    trackedLiquidityETH = trackedLiquidityUSD;
  }

  pair = await prisma.pair.update({
    where: { id: pair.id },
    data: {
      trackedReserveETH: trackedLiquidityETH,
      reserveETH: pair.reserve0
        .times(token0.derivedETH)
        .plus(pair.reserve1.times(token1.derivedETH)),
      // reserveUSD: pair.reserveUSD.times(bundle.ethPrice)
      reserveUSD: pair.reserveUSD,
    },
  });

  // use tracked amounts globally
  let factory = await prisma.stableswapFactory.update({
    where: {
      id: config.canto.contracts.baseV1Factory.addresses[0],
    },
    data: {
      totalLiquidityETH: { increment: trackedLiquidityETH },
    },
  });
  await prisma.stableswapFactory.update({
    where: {
      id: config.canto.contracts.baseV1Factory.addresses[0],
    },
    data: {
      // totalLiquidityUSD: factory.totalLiquidityETH.times(bundle.ethPrice),
      totalLiquidityUSD: factory.totalLiquidityETH,
    },
  });

  // correctly set liquidity amounts for each token
  await prisma.token.update({
    where: { id: token0.id },
    data: { totalLiquidity: { increment: pair.reserve0 } },
  });
  await prisma.token.update({
    where: { id: token0.id },
    data: { totalLiquidity: { increment: pair.reserve0 } },
  });
}

export async function handleMint(log: providers.Log) {
  console.log(`parsing: [mint] ${log.transactionHash}`);
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);

  const pair = await prisma.pair.findFirstOrThrow({
    where: { id: ethers.utils.getAddress(log.address) },
  });

  let transaction = await prisma.transaction.findFirstOrThrow({
    where: {
      id: log.transactionHash,
    },
    include: {
      mints: true,
    },
  });

  let mints = transaction.mints;

  // update txn counts
  const token0 = await prisma.token.update({
    where: { id: pair.token0Id },
    data: { txCount: { increment: 1 } },
  });
  const token1 = await prisma.token.update({
    where: { id: pair.token1Id },
    data: { txCount: { increment: 1 } },
  });

  // update exchange info (excpet balances, sync will cover that)
  let token0Amount = await convertTokenToDecimal(
    event.args.amount0,
    Number(token0.decimals)
  );
  let token1Amount = await convertTokenToDecimal(
    event.args.amount1,
    Number(token1.decimals)
  );

  // get new amount of USD and ETH for tracking
  const bundle = await prisma.bundle.findFirstOrThrow({
    where: { id: "1" },
  });
  let amountTotalETH = token1.derivedETH
    .times(token1Amount)
    .plus(token0.derivedETH.times(token0Amount));
  // let amountTotalUSD = amountTotalETH.times(bundle.ethPrice);
  let amountTotalUSD = amountTotalETH;

  // update txn counts
  await prisma.pair.update({
    where: { id: ethers.utils.getAddress(log.address) },
    data: { txCount: { increment: 1 } },
  });
  await prisma.stableswapFactory.update({
    where: { id: config.canto.contracts.baseV1Factory.addresses[0] },
    data: { txCount: { increment: 1 } },
  });

  // update mint
  const mint = await prisma.mint.update({
    where: { id: mints[mints.length - 1].id },
    data: {
      sender: event.args.sender,
      amount0: token0Amount,
      amount1: token1Amount,
      logIndex: Number(log.logIndex),
      amountUSD: amountTotalUSD,
    },
  });

  // update LP position
  const liquidityPosition = await createLiquidityPosition(
    ethers.utils.getAddress(log.address),
    mint.to
  );
  await createLiquiditySnapshot(liquidityPosition, log);

  // update day metric objects
  await updatePairDayData(log);
  await updatePairHourData(log);
  await updateFactoryDayData(log);
  await updateTokenDayData(token0, log);
  await updateTokenDayData(token1, log);
}

export async function handleBurn(log: any) {
  console.log(`parsing: [burn] ${log.transactionHash}`);
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);

  const pair = await prisma.pair.findFirstOrThrow({
    where: { id: ethers.utils.getAddress(log.address) },
  });

  // burns
  let transaction = await prisma.transaction.findFirstOrThrow({
    where: {
      id: log.transactionHash,
    },
    include: {
      burns: true,
    },
  });
  let burns = transaction.burns;

  // update txn counts
  const token0 = await prisma.token.update({
    where: { id: pair.token0Id },
    data: { txCount: { increment: 1 } },
  });
  const token1 = await prisma.token.update({
    where: { id: pair.token1Id },
    data: { txCount: { increment: 1 } },
  });

  // update token info
  let token0Amount = await convertTokenToDecimal(
    event.args.amount0,
    Number(token0.decimals)
  );
  let token1Amount = await convertTokenToDecimal(
    event.args.amount1,
    Number(token1.decimals)
  );

  // get new amount of USD and ETH for tracking
  const bundle = await prisma.bundle.findFirstOrThrow({
    where: { id: "1" },
  });
  let amountTotalETH = token1.derivedETH
    .times(token1Amount)
    .plus(token0.derivedETH.times(token0Amount));
  // let amountTotalUSD = amountTotalETH.times(bundle.ethPrice);
  let amountTotalUSD = amountTotalETH;

  // update txn counts
  await prisma.pair.update({
    where: { id: ethers.utils.getAddress(log.address) },
    data: { txCount: { increment: 1 } },
  });
  await prisma.stableswapFactory.update({
    where: { id: config.canto.contracts.baseV1Factory.addresses[0] },
    data: { txCount: { increment: 1 } },
  });

  // update burn
  const burn = await prisma.burn.update({
    where: { id: burns[burns.length - 1].id },
    data: {
      amount0: token0Amount,
      amount1: token1Amount,
      logIndex: Number(log.logIndex),
      amountUSD: amountTotalUSD,
    },
  });

  // update LP position
  const liquidityPosition = await createLiquidityPosition(
    ethers.utils.getAddress(log.address),
    burn.sender!
  );
  await createLiquiditySnapshot(liquidityPosition, log);

  // update day metric objects
  await updatePairDayData(log);
  await updatePairHourData(log);
  await updateFactoryDayData(log);
  await updateTokenDayData(token0, log);
  await updateTokenDayData(token1, log);
}

export async function handleSwap(log: any) {
  console.log(`parsing: [swap] ${log.transactionHash}`);
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);

  const timestamp = await getBlockTimestamp(log.blockNumber);

  // load
  let pair = await prisma.pair.findFirstOrThrow({
    where: { id: ethers.utils.getAddress(log.address) },
    include: { token0: true, token1: true },
  });
  let token0 = pair.token0;
  let token1 = pair.token1;

  let amount0In = await convertTokenToDecimal(
    event.args.amount0In,
    Number(token0.decimals)
  );
  let amount1In = await convertTokenToDecimal(
    event.args.amount1In,
    Number(token1.decimals)
  );
  let amount0Out = await convertTokenToDecimal(
    event.args.amount0Out,
    Number(token0.decimals)
  );
  let amount1Out = await convertTokenToDecimal(
    event.args.amount1Out,
    Number(token1.decimals)
  );

  // totals for volume updates
  let amount0Total = amount0Out.plus(amount0In);
  let amount1Total = amount1Out.plus(amount1In);

  // get new amount of USD and ETH for tracking
  const bundle = await prisma.bundle.findFirstOrThrow({
    where: { id: "1" },
  });

  // get total amounts of derived USD and ETH for tracking
  let derivedAmountETH = token1.derivedETH
    .times(amount1Total)
    .plus(token0.derivedETH.times(amount0Total))
    .div(new Decimal("2"));

  // let derivedAmountUSD = derivedAmountETH.times(bundle.ethPrice);
  let derivedAmountUSD = derivedAmountETH;

  // only accounts for volume through white listed tokens
  let trackedAmountUSD = await getTrackedVolumeUSD(
    amount0Total,
    token0,
    amount1Total,
    token1,
    pair
  );

  let trackedAmountETH: Decimal = trackedAmountUSD;

  if (bundle.ethPrice.equals(ZERO_BD)) {
    // trackedAmountETH = ZERO_BD;
    trackedAmountETH = trackedAmountUSD;
  } else {
    // trackedAmountETH = trackedAmountUSD.div(bundle.ethPrice);
    trackedAmountETH = trackedAmountUSD;
  }

  // update token0 global volume and token liquidity stats
  token0 = await prisma.token.update({
    where: { id: pair.token0Id },
    data: {
      tradeVolume: { increment: amount0In.plus(amount0Out) },
      tradeVolumeUSD: { increment: trackedAmountUSD },
      untrackedVolumeUSD: { increment: derivedAmountUSD },
      txCount: { increment: 1 },
    },
  });

  // update token1 global volume and token liquidity stats
  token1 = await prisma.token.update({
    where: { id: pair.token1Id },
    data: {
      tradeVolume: { increment: amount1In.plus(amount1Out) },
      tradeVolumeUSD: { increment: trackedAmountUSD },
      untrackedVolumeUSD: { increment: derivedAmountUSD },
      txCount: { increment: 1 },
    },
  });

  // update pair volume data, use tracked amount if we have it as its probably more accurate
  pair = await prisma.pair.update({
    where: { id: pair.id },
    data: {
      volumeUSD: { increment: trackedAmountUSD },
      volumeToken0: { increment: amount0Total },
      volumeToken1: { increment: amount1Total },
      untrackedVolumeUSD: { increment: derivedAmountUSD },
      txCount: { increment: 1 },
    },
    include: {
      token0: true,
      token1: true,
    },
  });

  // update global values, only used tracked amounts for volume
  await prisma.stableswapFactory.update({
    where: { id: config.canto.contracts.baseV1Factory.addresses[0] },
    data: {
      totalVolumeUSD: { increment: trackedAmountUSD },
      totalVolumeETH: { increment: trackedAmountETH },
      untrackedVolumeUSD: { increment: derivedAmountUSD },
      txCount: { increment: 1 },
    },
  });

  // update transaction
  const transaction = await prisma.transaction.upsert({
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
      burns: true,
      swaps: true,
    },
  });

  // swaps
  let swaps = transaction.swaps;
  const swap = await prisma.swap.create({
    data: {
      id: `${log.transactionHash}-${swaps.length}`,
      transactionId: transaction.id,
      pairId: pair.id,
      timestamp: transaction.timestamp,
      sender: event.args.sender,
      amount0In: amount0In,
      amount1In: amount1In,
      amount0Out: amount0Out,
      amount1Out: amount1Out,
      to: event.args.to,
      // from: event.transaction.from
      from: event.args.sender,
      logIndex: Number(log.logIndex),
      amountUSD:
        trackedAmountUSD === ZERO_BD ? derivedAmountUSD : trackedAmountUSD,
    },
  });

  // update day entities
  let pairDayData = await updatePairDayData(log);
  let pairHourData = await updatePairHourData(log);
  let stableswapDayData = await updateFactoryDayData(log);
  let token0DayData = await updateTokenDayData(token0, log);
  let token1DayData = await updateTokenDayData(token1, log);

  // swap specific updating
  await prisma.stableswapDayData.update({
    where: { id: stableswapDayData.id },
    data: {
      dailyVolumeUSD: { increment: trackedAmountUSD },
      dailyVolumeETH: { increment: trackedAmountETH },
      dailyVolumeUntracked: { increment: derivedAmountUSD },
    },
  });

  // swap specific updating for pair
  await prisma.pairDayData.update({
    where: { id: pairDayData.id },
    data: {
      dailyVolumeToken0: { increment: amount0Total },
      dailyVolumeToken1: { increment: amount1Total },
      dailyVolumeUSD: { increment: trackedAmountUSD },
    },
  });

  // update hourly pair data
  await prisma.pairHourData.update({
    where: { id: pairHourData.id },
    data: {
      hourlyVolumeToken0: { increment: amount0Total },
      hourlyVolumeToken1: { increment: amount1Total },
      hourlyVolumeUSD: { increment: trackedAmountUSD },
    },
  });

  // swap specific updating for token0
  await prisma.tokenDayData.update({
    where: { id: token0DayData.id },
    data: {
      dailyVolumeToken: { increment: amount0Total },
      dailyVolumeETH: { increment: amount0Total.times(token0.derivedETH) },
      // dailyVolumeUSD: {increment: amount0Total.times(token0.derivedETH).times(bundle.ethPrice)},
      dailyVolumeUSD: { increment: amount0Total.times(token0.derivedETH) },
    },
  });

  // swap specific updating
  await prisma.tokenDayData.update({
    where: { id: token1DayData.id },
    data: {
      dailyVolumeToken: { increment: amount1Total },
      dailyVolumeETH: { increment: amount1Total.times(token1.derivedETH) },
      // dailyVolumeUSD: {increment: amount1Total.times(token1.derivedETH).times(bundle.ethPrice)},
      dailyVolumeUSD: { increment: amount1Total.times(token1.derivedETH) },
    },
  });
}
