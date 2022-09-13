import prisma from "../prisma";
import config from "../config";
import { Token, Pair } from "@prisma/client";
import { ADDRESS_ZERO, ZERO_BD, ONE_BD } from "./contants";
import { factoryContract } from "./helpers";
import { Decimal } from "@prisma/client/runtime";

export async function getEthPriceInUSD() {
  const usdtPair = await prisma.pair.findFirst({
    where: { id: config.canto.NOTE_USDT_PAIR },
  }); // token1 = usdt
  const usdcPair = await prisma.pair.findFirst({
    where: { id: config.canto.NOTE_USDC_PAIR },
  }); // token1 = usdc

  if (usdtPair !== null && usdcPair !== null) {
    let totalLiquidityNOTE = usdtPair.reserve0.plus(usdcPair.reserve0);

    if (totalLiquidityNOTE.equals(ZERO_BD)) {
      return ZERO_BD;
    }

    let usdtWeight = usdtPair.reserve0.div(totalLiquidityNOTE);
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityNOTE);

    return usdtPair.token0Price
      .times(usdtWeight)
      .plus(usdcPair.token0Price.times(usdcWeight));
  } else if (usdtPair !== null) {
    return usdtPair.token0Price;
  } else if (usdcPair !== null) {
    return usdcPair.token0Price;
  } else {
    return ZERO_BD;
  }
}

export async function findEthPerToken(token: Token) {
  if (token.id == config.canto.wCANTO_ADDRESS) {
    return ONE_BD;
  }

  // loop through whitelist and check if paired with any
  for (let i = 0; i < config.canto.WHITELIST.length; ++i) {
    const pairAddress = await factoryContract.getPair(
      token.id,
      config.canto.WHITELIST[i],
      true
    );
    const pairAddress0 = await factoryContract.getPair(
      token.id,
      config.canto.WHITELIST[i],
      false
    );

    // TODO: which pair to use?
    // console.log("PAIR ADDRESS", pairAddress, pairAddress0)

    // console.log("NOTE PER TOKEN: ", token.id, WHITELIST[i], pairAddress);
    if (pairAddress != ADDRESS_ZERO) {
      const pair = await prisma.pair.findFirstOrThrow({
        where: { id: pairAddress },
      });
      if (
        pair.token0Id == token.id
        // && pair.reserveNOTE.gt(config.canto.MINIMUM_LIQUIDITY_THRESHOLD_NOTE)
      ) {
        const token1 = await prisma.token.findFirstOrThrow({
          where: { id: pair.token1Id },
        });
        return pair.token1Price.times(token1.derivedNOTE); // return token1 per our token * Eth per token 1
      }
      if (
        pair.token1Id == token.id
        // && pair.reserveNOTE.gt(config.canto.MINIMUM_LIQUIDITY_THRESHOLD_NOTE)
      ) {
        const token0 = await prisma.token.findFirstOrThrow({
          where: { id: pair.token0Id },
        });
        return pair.token0Price.times(token0.derivedNOTE); // return token1 per our token * Eth per token 1
      }
    }
  }
  return ZERO_BD; // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export async function getTrackedLiquidityUSD(
  tokenAmount0: Decimal,
  token0: Token,
  tokenAmount1: Decimal,
  token1: Token
) {
  const WHITELIST = config.canto.WHITELIST;

  const bundle = await prisma.bundle.findFirstOrThrow({
    where: { id: "1" },
  });
  // let price0 = token0.derivedNOTE.times(bundle.notePrice);
  let price0 = token0.derivedNOTE;
  // let price1 = token1.derivedNOTE.times(bundle.notePrice);
  let price1 = token1.derivedNOTE;

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(new Decimal("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(new Decimal("2"));
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}

export async function getTrackedVolumeUSD(
  tokenAmount0: Decimal,
  token0: Token,
  tokenAmount1: Decimal,
  token1: Token,
  pair: Pair
) {
  const WHITELIST: string[] = config.canto.WHITELIST;
  const UNTRACKED_PAIRS: string[] = config.canto.UNTRACKED_PAIRS;
  const MINIMUM_USD_THRESHOLD_NEW_PAIRS =
    config.canto.MINIMUM_USD_THRESHOLD_NEW_PAIRS;

  // services
  const bundle = await prisma.bundle.findFirstOrThrow({
    where: { id: "1" },
  });

  // let price0 = token0.derivedNOTE.times(bundle.notePrice));
  let price0 = token0.derivedNOTE;
  // let price1 = token1.derivedNOTE.times(bundle.notePrice);
  let price1 = token1.derivedNOTE;

  // dont count tracked volume on these pairs - usually rebass tokens
  if (UNTRACKED_PAIRS.includes(pair.id)) {
    return ZERO_BD;
  }

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(new Decimal(5))) {
    let reserve0USD = pair.reserve0.times(price0);
    let reserve1USD = pair.reserve1.times(price1);

    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD;
      }
    }

    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (
        reserve0USD.times(new Decimal("2")).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)
      ) {
        return ZERO_BD;
      }
    }

    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (
        reserve1USD.times(new Decimal("2")).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)
      ) {
        return ZERO_BD;
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0
      .times(price0)
      .plus(tokenAmount1.times(price1))
      .div(new Decimal("2"));
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0);
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1);
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}
