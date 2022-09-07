
import { Config } from '../config';
import cTokenABI from '../../abis/CToken.json';
import BaseV1RouterABI from '../../abis/BaseV1Router.json'
import { ethers } from 'ethers';
import provider from "../provider";
import { Prisma } from '@prisma/client'
import prisma from "../prisma";
import { ADDRESS_ZERO, cCANTO_ADDRESS, cTOKEN_DECIMALS_PD, cUSDC_ADDRESS, MANTISSA_FACTOR, MANTISSA_FACTOR_PD, ZERO_PD } from './consts';
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from './token';
import { FormatTypes, Interface } from 'ethers/lib/utils';

export async function createMarket(marketAddress: string) {
  let cUSDCAddress = Config.canto.lendingDashboard.cUSDC_ADDRESS;
  let cCANTO_ADDRESS = Config.canto.lendingDashboard.cCANTO_ADDRESS;
  let cwCANTO_ADDRESS = Config.canto.lendingDashboard.cW_CANTO_ADDRESS;
  let wCANTO_ADDRESS = Config.canto.lendingDashboard.wCANTO_ADDRESS;
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
  } else if (marketAddress == cwCANTO_ADDRESS) {
    market = {
      id: marketAddress,
      symbol: await fetchTokenSymbol(marketAddress), // tood: is marketAdd correct param
      name: await fetchTokenName(marketAddress),
      underlyingAddress: wCANTO_ADDRESS,
      underlyingName: "wCanto",
      underlyingSymbol: "WCANTO",
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
  let marketObj = await prisma.market.create({
    data: market
  })
  return marketObj;
}

export async function updateMarket(
  marketId: string,
  blockNumber: Prisma.Decimal,
  blockTimestamp: number
) {
  let market = await prisma.market.findUnique({
    where: {
      id: marketId
    }
  });

  if (market == null) {
    market = await createMarket(marketId);
  }

  let accrualBlockNumber = market.accrualBlockNumber;
  let underlyingDecimals = market.underlyingDecimals.toNumber();
  if (!accrualBlockNumber.equals(blockNumber)) {

    let contract = new ethers.Contract(marketId, cTokenABI, provider);
    // todo:
    let usdPriceInEth = await getUSDCPrice(blockNumber);
    
    if (marketId == cCANTO_ADDRESS) {
      let underlyingPriceDiv = market.underlyingPrice
        .div(usdPriceInEth);
      let underlyingPriceUSD = underlyingPriceDiv
        .toDecimalPlaces(underlyingDecimals);

      market.underlyingPriceUSD = underlyingPriceUSD;
    } else {
      let tokenEthPrice = await getTokenPrice(
        blockNumber,
        marketId,
        market.underlyingAddress,
        underlyingDecimals,
      );
      let underlyingPrice = tokenEthPrice
        .toDecimalPlaces(underlyingDecimals)
      market.underlyingPrice = underlyingPrice;

      // if USDC, we only update ETH price
      if (marketId == cUSDC_ADDRESS) {
        let underlyingPriceDiv = market.underlyingPrice
          .div(usdPriceInEth);
        let underlyingPriceUSD = underlyingPriceDiv
          .toDecimalPlaces(underlyingDecimals);

        market.underlyingPriceUSD = underlyingPriceUSD;
      }
    }

    // timestamp
    market.blockTimestamp = new Prisma.Decimal(blockTimestamp.toString());

    // accrual number
    market.accrualBlockNumber = await contract.accrualBlockNumber();

    // total supply
    let totalSupplyExpanded = await contract.totalSupply();
    let totalSupply = totalSupplyExpanded.div(cTOKEN_DECIMALS_PD);
    market.totalSupply = totalSupply;

    // exchange rate
    let exchangeRateStoredExpanded = await contract.exchangeRateStored();
    let exchangeRate = exchangeRateStoredExpanded
      .div(exponentToPD(underlyingDecimals))
      .times(cTOKEN_DECIMALS_PD)
      .div(MANTISSA_FACTOR_PD)
      .toDecimalPlaces(MANTISSA_FACTOR);
    market.exchangeRate = exchangeRate;

    // borrow index
    let borrowIndexStored = await contract.borrowIndex();
    let borrowIndex = borrowIndexStored
      .div(MANTISSA_FACTOR_PD)
      .toDecimalPlaces(MANTISSA_FACTOR);
    market.borrowIndex = borrowIndex;

    // reserves
    let totalReservesStored = await contract.totalReserves();
    let totalReserves = totalReservesStored
      .div(exponentToPD(underlyingDecimals))
      .toDecimalPlaces(underlyingDecimals)
    market.reserves = totalReserves;

    // total borrows
    let totalBorrowsStored = await contract.totalBorrows();
    let totalBorrows = totalBorrowsStored
      .div(exponentToPD(underlyingDecimals))
      .toDecimalPlaces(underlyingDecimals)
    market.totalBorrows = totalBorrows;

    // cash
    let cashStored = await contract.getCash();
    let cash = cashStored
      .div(exponentToPD(underlyingDecimals))
      .toDecimalPlaces(underlyingDecimals)
    market.cash = cash;

    // supply rate
    let supplyRateStored = await contract.borrowRatePerBlock() // todo
    let supplyRate = supplyRateStored
      .times(new Prisma.Decimal('2102400')) // todo: what is this factor
      .div(MANTISSA_FACTOR_PD)
      .truncate(MANTISSA_FACTOR);
    market.supplyRate = supplyRate;
    
    // borrow rate
    let borrowRateStored = await contract.borrowRatePerBlock() // todo
    let borrowRate = borrowRateStored
      .times(new Prisma.Decimal('2102400')) // todo: what is this factor
      .div(MANTISSA_FACTOR_PD)
      .truncate(MANTISSA_FACTOR);
    market.borrowRate = borrowRate;

    // update
    await prisma.market.update({
      where: {
        id: marketId
      },
      data: market
    })

  }

  return market;
}

export function exponentToPD(exp: number) {
  return Prisma.Decimal.pow(10, exp);
}

// todo
async function getTokenPrice(
  blockNumber: Prisma.Decimal,
  eventAddress: string,
  underlyingAddress: string,
  underlyingDecimals: number
) {
  let comptroller = await prisma.comptroller.findUnique({
    where: {
      id: "1"
    }
  });

  if (comptroller == null) {
    return;
  }

  let oracleAddress = comptroller.priceOracle;
  let mantissaDecimalFactor = 18 - underlyingDecimals + 18;
  let bdFactor = exponentToPD(mantissaDecimalFactor);
  let contract = new ethers.Contract(oracleAddress, BaseV1RouterABI, provider); // todo: abi
  
  let priceStored = await contract.getUnderlyingPrice(eventAddress);
  let underlyingPrice = priceStored.div(bdFactor);
  
  return underlyingPrice;
}

async function getUSDCPrice(blockNumber: Prisma.Decimal) {
  let comptroller = await prisma.comptroller.findUnique({
    where: {
      id: "1"
    }
  });

  let oracleAddress = Config.canto.contracts.baseV1Router.addresses[0];
  if (comptroller !== null) {
    oracleAddress = comptroller.priceOracle;
  }

  let contract = new ethers.Contract(oracleAddress, BaseV1RouterABI, provider);
  let underlyingDecimals = 6;
  let mantissaDecimalFactor = 18 - underlyingDecimals + 18
  let bdFactor = exponentToPD(mantissaDecimalFactor)
  
  let priceStored = await contract.getUnderlyingPrice(cUSDC_ADDRESS);
  let underlyingPrice = priceStored.div(bdFactor);

  return underlyingPrice
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

export async function getTimestamp(blockNumber: Prisma.Decimal) {
  let block = await provider.getBlock(blockNumber.toNumber());
  return block.timestamp;
}

export async function updateCommonCTokenStats(
  marketId: string,
  marketSymbol: string,
  accountId: string,
  txHash: string,
  timestamp: number,
  blockNumber: Prisma.Decimal,
  enteredMarket: boolean
) {
  let cTokenStatId = marketId.concat("-").concat(accountId);

  // update or upsert
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
      enteredMarket: enteredMarket
    },
    create: {
      id: cTokenStatId,
      account: accountId,
      market: marketId,
      symbol: marketSymbol,
    }
  });

  return cTokenStats;
}