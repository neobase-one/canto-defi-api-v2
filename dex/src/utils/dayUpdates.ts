import prisma from "../prisma";
import config from "../config";
import { Token } from "@prisma/client";
import { ADDRESS_ZERO, ZERO_BD, ONE_BD } from "./contants";
import { factoryContract } from "./helpers";
import { Decimal } from "@prisma/client/runtime";
import { providers } from "ethers";
import { getBlockTimestamp } from "./helpers";
import { ethers } from "ethers";

const FACTORY_ADDRESS = config.canto.contracts.baseV1Factory.addresses[0];

export async function updateFactoryDayData(event: providers.Log) {
  const timestamp = await getBlockTimestamp(event.blockNumber);
  let dayId = timestamp / 86400;
  let dayStartTimestamp = parseInt(dayId.toString()) * 86400;

  const factory = await prisma.stableswapFactory.findFirstOrThrow({
    where: { id: FACTORY_ADDRESS },
  });

  const factoryDayData = await prisma.stableswapDayData.upsert({
    where: {
      id: dayId.toString(),
    },
    create: {
      id: dayId.toString(),
      date: dayStartTimestamp,
      totalLiquidityNOTE: factory.totalLiquidityNOTE,
      totalLiquidityUSD: factory.totalLiquidityUSD,
      txCount: factory.txCount,
    },
    update: {
      totalLiquidityNOTE: factory.totalLiquidityNOTE,
      totalLiquidityUSD: factory.totalLiquidityUSD,
      txCount: factory.txCount,
    },
  });
  return factoryDayData;
}

export async function updatePairDayData(event: providers.Log) {
  const timestamp = await getBlockTimestamp(event.blockNumber);
  let dayId = timestamp / 86400;
  let dayStartTimestamp = parseInt(dayId.toString()) * 86400;

  // load
  const pair = await prisma.pair.findFirstOrThrow({
    where: {
      id: ethers.utils.getAddress(ethers.utils.getAddress(event.address)),
    },
  });

  const pairDayData = await prisma.pairDayData.upsert({
    where: {
      id: `${ethers.utils.getAddress(event.address)}-${new Decimal(
        dayId
      ).toString()}`,
    },
    create: {
      id: `${ethers.utils.getAddress(event.address)}-${new Decimal(
        dayId
      ).toString()}`,
      date: dayStartTimestamp,
      token0Id: pair.token0Id,
      token1Id: pair.token1Id,
      pairAddress: ethers.utils.getAddress(event.address),
      totalSupply: pair.totalSupply,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      reserveUSD: pair.reserveUSD,
      dailyTxns: 1,
    },
    update: {
      totalSupply: pair.totalSupply,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      reserveUSD: pair.reserveUSD,
      dailyTxns: { increment: 1 },
    },
  });

  return pairDayData;
}

export async function updatePairHourData(event: providers.Log) {
  const timestamp = await getBlockTimestamp(event.blockNumber);
  let hourIndex = timestamp / 3600;
  let hourStartUnix = parseInt(hourIndex.toString()) * 3600;

  let hourPairId = `${ethers.utils.getAddress(event.address)}-${new Decimal(
    hourIndex
  ).toString()}`;

  // load
  const pair = await prisma.pair.findFirstOrThrow({
    where: { id: ethers.utils.getAddress(event.address) },
  });

  const pairHourData = await prisma.pairHourData.upsert({
    where: { id: hourPairId },
    create: {
      id: hourPairId,
      hourStartUnix: hourStartUnix,
      pairId: ethers.utils.getAddress(event.address),
      totalSupply: pair.totalSupply,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      reserveUSD: pair.reserveUSD,
      hourlyTxns: 1,
    },
    update: {
      totalSupply: pair.totalSupply,
      reserve0: pair.reserve0,
      reserve1: pair.reserve1,
      reserveUSD: pair.reserveUSD,
      hourlyTxns: { increment: 1 },
    },
  });
  return pairHourData;
}

export async function updateTokenDayData(token: Token, event: providers.Log) {
  const bundle = await prisma.bundle.findFirstOrThrow({ where: { id: "1" } });
  const timestamp = await getBlockTimestamp(event.blockNumber);

  let dayId = timestamp / 86400;
  let dayStartTimestamp = parseInt(dayId.toString()) * 86400;
  let tokenDayId = `${token.id}-${new Decimal(dayId).toString()}`;

  const tokenDayData = await prisma.tokenDayData.upsert({
    where: { id: tokenDayId },
    create: {
      id: tokenDayId,
      date: dayStartTimestamp,
      tokenId: token.id,
      priceUSD: token.derivedNOTE.times(bundle.notePrice),
      // priceUSD: token.derivedNOTE,
      totalLiquidityToken: token.totalLiquidity,
      totalLiquidityNOTE: token.totalLiquidity.times(token.derivedNOTE),
      totalLiquidityUSD: token.totalLiquidity.times(token.derivedNOTE).times(bundle.notePrice),
      // totalLiquidityUSD: token.totalLiquidity.times(token.derivedNOTE),
      dailyTxns: 1,
    },
    update: {
      priceUSD: token.derivedNOTE,
      totalLiquidityToken: token.totalLiquidity,
      totalLiquidityNOTE: token.totalLiquidity.times(token.derivedNOTE),
      totalLiquidityUSD: token.totalLiquidity.times(token.derivedNOTE).times(bundle.notePrice),
      // totalLiquidityUSD: token.totalLiquidity.times(token.derivedNOTE),
      dailyTxns: { increment: 1 },
    },
  });

  return tokenDayData;
}
