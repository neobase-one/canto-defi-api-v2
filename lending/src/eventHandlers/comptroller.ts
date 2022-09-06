import prisma from "../prisma";
import { Config } from "../config";
import { createMarket, getTimestamp, updateCommonCTokenStats } from "../utils/helper";
import { D_10_18 } from "../utils/consts";
import { Prisma } from "@prisma/client";

export async function handleMarketListed(log: any) {
  console.log("Comptroller", "MarketListed", parseInt(log.blockNumber, 16), log.transactionHash)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  let address = event.args.cToken;

  await createMarket(address);
}

export async function handleMarketEntered(log: any) {
  console.log("Comptroller", "MarketEntered", parseInt(log.blockNumber, 16), log.transactionHash)
  console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  console.log(event)
  let address = log.address;
  let blockNumber = new Prisma.Decimal(parseInt(log.blockNumber));
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

  if (market == null) {
    market = await createMarket(address);
  }

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
  } else {
    console.log(address);
  }
}

export async function handleMarketExited(log: any) {
  console.log("Comptroller", "MarketExited", parseInt(log.blockNumber, 16), log.transactionHash)
  // console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  // console.log(event)
  let address = log.address;
  let blockNumber = new Prisma.Decimal(parseInt(log.blockNumber));
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

  if (market == null) {
    market = await createMarket(address);
  }

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
  } else {
    console.log(address);
  }
}

export async function handleNewCloseFactor(log: any) {
  console.log("Comptroller", "NewCloseFactor", parseInt(log.blockNumber, 16), log.transactionHash)
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
  console.log("Comptroller", "NewCollateralFactor", parseInt(log.blockNumber, 16), log.transactionHash)
  // console.log(log)
  const event = Config.canto.contracts.comptroller.interface.parseLog(log);
  // console.log(event)

  let marketId = event.args.cToken;
  let mantissa = new Prisma.Decimal(event.args.newCollateralFactorMantissa.toString());
  let collateralFactor = mantissa.div(D_10_18)

  // object for
  let market = await prisma.market.findUnique({
    where: {
      id: marketId
    }
  });

  if (market == null) {
    await createMarket(marketId);
  }

  await prisma.market.update({
    where: {
      id: marketId
    },
    data: {
      collateralFactor: collateralFactor
    }
  })
}

export async function handleNewLiquidationIncentive(log: any) {
  console.log("Comptroller", "NewLiquidationIncentive", parseInt(log.blockNumber, 16), log.transactionHash)
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
  console.log("Comptroller", "NewPriceOracle", parseInt(log.blockNumber, 16), log.transactionHash)
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
