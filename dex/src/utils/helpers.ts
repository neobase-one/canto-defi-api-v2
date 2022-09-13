import provider from "../provider";
import prisma from "../prisma";
import { LiquidityPosition, Prisma } from "@prisma/client";
import { providers } from "ethers";
import { time } from "console";
import { ethers } from "ethers";
import config from "../config";
import BaseV1FactoryABI from "../../abis/BaseV1Factory.json";
import { Decimal } from "@prisma/client/runtime";

export const factoryContract = new ethers.Contract(
  config.canto.contracts.baseV1Factory.addresses[0],
  BaseV1FactoryABI,
  provider
);

export async function getBlockTimestamp(blockNumber: number) {
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}

export async function exponentToBigDecimal(decimals: number) {
  let bd = new Decimal("1");
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(new Decimal("10"));
  }
  return bd;
}

export async function convertTokenToDecimal(
  tokenAmount: Decimal,
  exchangeDecimals: number
) {
  if (exchangeDecimals == 0) {
    return tokenAmount;
  }
  return new Decimal(tokenAmount.toString()).div(
    await exponentToBigDecimal(exchangeDecimals)
  );
}

export async function isCompleteMint(mintId: string): Promise<boolean> {
  return (
    (await prisma.mint.findFirstOrThrow({ where: { id: mintId } })).sender !=
    null
  );
}

export async function createUser(address: string) {
  await prisma.user.upsert({
    where: {
      id: address,
    },
    update: {},
    create: {
      id: address,
    },
  });
}

export async function createLiquidityPosition(exchange: string, user: string) {
  if (
    !(await prisma.liquidityPosition.count({
      where: { id: `${exchange}-${user}` },
    }))
  ) {
    await prisma.pair.update({
      where: {
        id: exchange,
      },
      data: {
        liquidityProviderCount: { increment: 1 },
      },
    });
  }

  const liquidityPosition = await prisma.liquidityPosition.upsert({
    where: {
      id: `${exchange}-${user}`,
    },
    create: {
      id: `${exchange}-${user}`,
      liquidityTokenBalance: 0,
      pairId: exchange,
      userId: user,
    },
    update: {},
  });

  if (liquidityPosition === null) {
    console.log("ERROR: LiquidityTokenBalance is null", [
      `${exchange}-${user}`,
    ]);
  }

  return liquidityPosition;
}

export async function createLiquiditySnapshot(
  position: LiquidityPosition,
  event: providers.Log
) {
  const timestamp: any = await getBlockTimestamp(event.blockNumber);

  const pair = await prisma.pair.findFirstOrThrow({
    where: { id: position.pairId },
    include: { token0: true, token1: true },
  });

  const data = {
    id: `${position.id}${timestamp}}`,
    timestamp: timestamp,
    block: parseInt(event.blockNumber.toString()),
    userId: position.userId,
    pairId: position.pairId,
    token0PriceUSD: pair.token0.derivedNOTE,
    token1PriceUSD: pair.token1.derivedNOTE,
    reserve0: pair.reserve0,
    reserve1: pair.reserve1,
    reserveUSD: pair.reserveUSD,
    liquidityTokenTotalSupply: pair.totalSupply,
    liquidityTokenBalance: position.liquidityTokenBalance,
    liquidityPositionId: position.id,
  };
  await prisma.liquidityPositionSnapshot.upsert({
    where: {
      id: `${position.id}${timestamp}}`,
    },
    create: data,
    update: data,
  });
}
