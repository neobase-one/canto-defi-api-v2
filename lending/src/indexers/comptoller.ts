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

export async function indexComptrollerEvents() {
  // while (1) {
  const bs = await prisma.blockSyncLending.findUniqueOrThrow({
    where: { id: "Comptroller" },
    select: { blockSynced: true },
  });
  const logs = await provider.send("eth_getLogs", [
    {
      fromBlock: "0x" + bs.blockSynced.toString(16),
      toBlock:
        "0x" + (bs.blockSynced + Config.canto.blockLookupWindow).toString(16),
      topics: [Object.values(Config.canto.contracts.comptroller.topics)],
      address: Config.canto.contracts.comptroller.addresses,
    },
  ]);

  console.log(bs.blockSynced, logs.length);
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
    data: { blockSynced: bs.blockSynced + Config.canto.blockLookupWindow },
  });
  // }
  // console.log("sync complete: Comptroller");
}
