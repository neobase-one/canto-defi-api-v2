
import { Config } from '../config';
import cTokenABI from '../../abis/CToken.json';
import { ethers } from 'ethers';
import provider from "../provider";
import { Prisma } from '@prisma/client'
import prisma from "../prisma";
import { ADDRESS_ZERO, ZERO_PD } from './consts';
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from './token';
import { FormatTypes, Interface } from 'ethers/lib/utils';

export async function createMarket(marketAddress: string) {
  let cUSDCAddress = Config.canto.lendingDashboard.cUSDC_ADDRESS;
  let cCANTO_ADDRESS = Config.canto.lendingDashboard.cCANTO_ADDRESS;

  // create market object
  let market: Prisma.MarketCreateInput;

  if (marketAddress == cCANTO_ADDRESS) {
    market = {
      id: marketAddress,
      symbol: await fetchTokenSymbol(marketAddress),
      name: await fetchTokenName(marketAddress),
      underlyingAddress: ADDRESS_ZERO,
      underlyingName: "Canto",
      underlyingSymbol: "CANTO",
      underlyingPrice: new Prisma.Decimal(1),
      underlyingDecimals: new Prisma.Decimal(18),
    }
  } else {
    let underlyingAddress = await getUnderlyingAddress(marketAddress);

    market = {
      id: marketAddress,
      symbol: await fetchTokenSymbol(marketAddress),
      name: await fetchTokenName(marketAddress),
      underlyingAddress: underlyingAddress,
      underlyingName: await fetchTokenName(underlyingAddress),
      underlyingSymbol: await fetchTokenSymbol(underlyingAddress),
      underlyingDecimals: new Prisma.Decimal(await fetchTokenDecimals(underlyingAddress)),
    }

    if (marketAddress == cUSDCAddress) {
      market.underlyingPriceUSD = new Prisma.Decimal('1')
    }
  }

  // return market object
  return market;
}

async function getUnderlyingAddress(cTokenAddress: string): Promise<string> {
  let contract = new ethers.Contract(cTokenAddress, cTokenABI, provider);
  try {
    var underlyingAddress = await contract.functions.underlying();
    if (underlyingAddress == null) {
      return ADDRESS_ZERO;
    } else {
      return underlyingAddress[0];
    }
  } catch {
    return ADDRESS_ZERO;
  }
}
