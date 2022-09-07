import { providers } from "ethers";
import prisma from "../prisma";
import provider from "../provider";
import config from "../config";
import { Decimal } from "@prisma/client/runtime";
import {
  fetchTokenDecimals,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
} from "../utils/token";
import { getBlockTimestamp } from "../utils/helpers";

export async function handlePairCreated(log: providers.Log) {
  const event = config.canto.contracts.baseV1Factory.interface.parseLog(log);
  const factoryAddress = config.canto.contracts.baseV1Factory.addresses[0];
  if (
    !(await prisma.stableswapFactory.count({ where: { id: factoryAddress } }))
  ) {
    await prisma.bundle.create({
      data: {
        id: "1",
      },
    });
  }
  await prisma.stableswapFactory.upsert({
    where: {
      id: factoryAddress,
    },
    update: {
      pairCount: { increment: 1 },
    },
    create: {
      id: factoryAddress,
      pairCount: 1,
    },
  });

  const token0 = await prisma.token.upsert({
    where: {
      id: event.args.token0,
    },
    update: {},
    create: {
      id: event.args.token0,
      symbol: await fetchTokenSymbol(event.args.token0),
      name: await fetchTokenSymbol(event.args.token0),
      decimals: await fetchTokenDecimals(event.args.token0),
      totalSupply: await fetchTokenTotalSupply(event.args.token0),
    },
  });

  const token1 = await prisma.token.upsert({
    where: {
      id: event.args.token1,
    },
    update: {},
    create: {
      id: event.args.token1,
      symbol: await fetchTokenSymbol(event.args.token1),
      name: await fetchTokenSymbol(event.args.token1),
      decimals: await fetchTokenDecimals(event.args.token1),
      totalSupply: await fetchTokenTotalSupply(event.args.token1),
    },
  });

  await prisma.pair.upsert({
    where: {
      id: event.args.pair,
    },
    update: {},
    create: {
      id: event.args.pair,
      token0Id: token0.id,
      token1Id: token1.id,
      createdAtTimestamp: await getBlockTimestamp(log.blockNumber),
      createdAtBlockNumber: BigInt(log.blockNumber),
    },
  });
}
