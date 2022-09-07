import prisma from "../prisma";
import config from "../config";
import { Token } from "@prisma/client";
import { ADDRESS_ZERO, ZERO_BD, ONE_BD } from "./contants";
import { factoryContract } from "./helpers";
import { Decimal } from "@prisma/client/runtime";

export async function getEthPriceInUSD() {
  const usdtPair = await prisma.pair.findFirst({where: {id: config.canto.NOTE_USDT_PAIR}}); // token1 = usdt
  const usdcPair = await prisma.pair.findFirst({where: {id: config.canto.NOTE_USDC_PAIR}}); // token1 = usdc
  
  if (usdtPair !== null && usdcPair !== null) {
    let totalLiquidityETH = usdtPair.reserve0.plus(usdcPair.reserve0);
    
    if (totalLiquidityETH.equals(ZERO_BD)) {
      return ZERO_BD;
    }
    
    let usdtWeight = usdtPair.reserve0.div(totalLiquidityETH);
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH);
    
    return usdtPair.token0Price.times(usdtWeight).plus(usdcPair.token0Price.times(usdcWeight));
    
  } else if (usdtPair !== null) { return usdtPair.token0Price;
  } else if (usdcPair !== null) { return usdcPair.token0Price;
  } else { return ZERO_BD;
  }
}

export async function findEthPerToken(token: Token) {
  if (token.id == config.canto.wCANTO_ADDRESS) {
    return ONE_BD;
  }

  // loop through whitelist and check if paired with any
  for (let i = 0; i < config.canto.WHITELIST.length; ++i) {
    const pairAddress = await factoryContract.getPair(token.id, config.canto.WHITELIST[i], true)
    const pairAddress0 = await factoryContract.getPair(token.id, config.canto.WHITELIST[i], false)

    // TODO: which pair to use?
    // console.log("PAIR ADDRESS", pairAddress, pairAddress0)

    // console.log("NOTE PER TOKEN: ", token.id, WHITELIST[i], pairAddress);
    if (pairAddress != ADDRESS_ZERO) {
      const pair = await prisma.pair.findFirstOrThrow({where: {id: pairAddress}});
      if (
        pair.token0Id == token.id
        // && pair.reserveETH.gt(config.canto.MINIMUM_LIQUIDITY_THRESHOLD_ETH)
      ) {
        const token1 = await prisma.token.findFirstOrThrow({where: {id: pair.token1Id}})
        return pair.token1Price.times(token1.derivedETH); // return token1 per our token * Eth per token 1
      }
      if (
        pair.token1Id == token.id
        // && pair.reserveETH.gt(config.canto.MINIMUM_LIQUIDITY_THRESHOLD_ETH)
      ) {
        const token0 = await prisma.token.findFirstOrThrow({where: {id: pair.token0Id}})
        return pair.token0Price.times(token0.derivedETH); // return token1 per our token * Eth per token 1
      }
    }
  }
  return ZERO_BD; // nothing was found return 0
}

export async function getTrackedLiquidityUSD(
  tokenAmount0: Decimal,
  token0: Token,
  tokenAmount1: Decimal,
  token1: Token
) {
  const WHITELIST = config.canto.WHITELIST

  const bundle = await prisma.bundle.findFirstOrThrow({
    where: {id: '1'},
  })
  // let price0 = token0.derivedETH.times(bundle.ethPrice);
  let price0 = token0.derivedETH;
  // let price1 = token1.derivedETH.times(bundle.ethPrice);
  let price1 = token1.derivedETH;

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