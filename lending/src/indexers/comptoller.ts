import { Config } from "../config";
import {
  handleMarketEntered,
  handleMarketExited,
  handleMarketListed,
  handleNewCloseFactor,
  handleNewCollateralFactor,
  handleNewLiquidationIncentive,
  handleNewPriceOracle,
} from "../eventHandlers/comptroller";
import prisma from "../prisma";
import provider from "../provider";

export async function indexComptrollerEvents(start: number, end: number) {
  const bs = await prisma.blockSyncLending.findUniqueOrThrow({
    where: { id: "Comptroller" },
    select: { blockSynced: true },
  });

  if (bs.blockSynced > start) {
    return;
  }

  // get logs
  const logs = await provider.send("eth_getLogs", [
    {
      fromBlock: "0x" + start.toString(16),
      toBlock: "0x" + end.toString(16),
      topics: [Object.values(Config.canto.contracts.comptroller.topics)],
      address: Config.canto.contracts.comptroller.addresses,
    },
  ]);

  // process logs
  console.log("Comptroller", start, end, logs.length);
  for (let log of logs) {
    switch (log.topics[0]) {
      case Config.canto.contracts.comptroller.topics.MarketListed: {
        await handleMarketListed(log);
        break;
      }
      case Config.canto.contracts.comptroller.topics.MarketEntered: {
        await handleMarketEntered(log);
        break;
      }
      case Config.canto.contracts.comptroller.topics.MarketExited: {
        await handleMarketExited(log);
        break;
      }
      case Config.canto.contracts.comptroller.topics.NewCloseFactor: {
        await handleNewCloseFactor(log);
        break;
      }
      case Config.canto.contracts.comptroller.topics.NewCollateralFactor: {
        await handleNewCollateralFactor(log);
        break;
      }
      case Config.canto.contracts.comptroller.topics.NewLiquidationIncentive: {
        await handleNewLiquidationIncentive(log);
        break;
      }
      case Config.canto.contracts.comptroller.topics.NewPriceOracle: {
        await handleNewPriceOracle(log);
        break;
      }
    }
  }

  // const liveBlock = await provider.getBlockNumber();
  // if (liveBlock < bs.blockSynced + Config.canto.blockLookupWindow) {
  //   await prisma.blockSyncLending.update({
  //     where: { id: "Comptroller" },
  //     data: { blockSynced: liveBlock },
  //   });
  //   break;
  // }

  await prisma.blockSyncLending.update({
    where: { id: "Comptroller" },
    data: { blockSynced: end },
  });
  // }
  // console.log("sync complete: Comptroller");
}
