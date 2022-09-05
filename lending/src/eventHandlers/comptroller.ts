import prisma from "../prisma";
import { Config } from "../config";
import { createMarket, getTimestamp, updateCommonCTokenStats } from "../utils/helper";
import { D_10_18 } from "../utils/consts";
import { Prisma } from "@prisma/client";

export async function handleMarketListed(log: any) {
  console.log("MarketListed", parseInt(log.blockNumber, 16),log.transactionHash)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  let address = event.args.cToken;

  let market = await createMarket(address);
  await prisma.market.upsert({
    where: {
      id: address
    },
    update: {},
    create: market
  });

}

export async function handleMarketEntered(log: any) {
  console.log("MarketEntered", parseInt(log.blockNumber, 16),log.transactionHash)
  // console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  // console.log(event)
  let address = log.address;
  let blockNumber = parseInt(log.blockNumber);
  let account = event.args.account;
  let txnHash = log.transactionHash;
  let timestamp = await getTimestamp(blockNumber);

  let market = await prisma.market.findUnique({
    where: { id: address },
    select: {
      id: true,
      symbol: true
    }
  });

  if (market !== null) {
    let enteredMarket = true;
    await updateCommonCTokenStats(
      market.id,
      market.symbol,
      account,
      txnHash,
      timestamp,
      blockNumber,
      enteredMarket
    );
  }
}

export async function handleMarketExited(log: any) {
  console.log("MarketExited", parseInt(log.blockNumber, 16),log.transactionHash)
  // console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  // console.log(event)
  let address = log.address;
  let blockNumber = parseInt(log.blockNumber);
  let account = event.args.account;
  let txnHash = log.transactionHash;
  let timestamp = await getTimestamp(blockNumber);

 let market = await prisma.market.findUnique({
  where: { id: address },
  select: {
    id: true,
    symbol: true
  }
 });

 if (market !== null) {
  let enteredMarket = false;
  await updateCommonCTokenStats(
    market.id,
    market.symbol,
    account,
    txnHash,
    timestamp,
    blockNumber,
    enteredMarket
  );
 }
}

export async function handleNewCloseFactor(log: any) {
  console.log("NewCloseFactor", parseInt(log.blockNumber, 16),log.transactionHash)
  // console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  // console.log(event)

  let mantissa = new Prisma.Decimal(event.args.newCloseFactorMantissa.toString());
  let closeFactor = mantissa.div(D_10_18)

  await prisma.comptroller.update({
    where: {
      id: '1'
    },
    data: {
      closeFactor: closeFactor
    }
  })
}

export async function handleNewCollateralFactor(log: any) {
  console.log("NewCollateralFactor", parseInt(log.blockNumber, 16),log.transactionHash)
  // console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  // console.log(event)

  let address = log.address;
  let mantissa = new Prisma.Decimal(event.args.newCollateralFactorMantissa.toString());
  let collateralFactor = mantissa.div(D_10_18)

  // object for
  let market = await createMarket(address);
  market.collateralFactor = collateralFactor

  await prisma.market.upsert({
    where: {
      id: address
    },
    update: {
      collateralFactor: collateralFactor
    },
    create: market
  })
}

export async function handleNewLiquidationIncentive(log: any) {
  console.log("NewLiquidationIncentive", parseInt(log.blockNumber, 16),log.transactionHash)
  // console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  // console.log(event)

  let mantissa = new Prisma.Decimal(event.args.newLiquidationIncentiveMantissa.toString());
  let liquidationIncentive = mantissa.div(D_10_18)

  await prisma.comptroller.update({
    where: {
      id: '1'
    },
    data: {
      liquidationIncentive: liquidationIncentive
    }
  })
}

export async function handleNewPriceOracle(log: any) {
  console.log("NewPriceOracle", parseInt(log.blockNumber, 16),log.transactionHash)
  // console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  // console.log(event)

  let priceOracle = event.args.newPriceOracle

  await prisma.comptroller.upsert({
    where: {
      id: '1'
    },
    update: {
      priceOracle: priceOracle
    },
    create: {
      id: '1',
      priceOracle: priceOracle
    }
  });
}
