import { Config } from "../config";
import {
  handleAccrueInterest,
  handleBorrow,
  handleLiquidateBorrow,
  handleNewMarketInterestRateModel,
  handleNewReserveFactor,
  handleRepayBorrow,
  handleTransfer,
} from "../eventHandlers/cToken";
import prisma from "../prisma";
import provider from "../provider";

export async function indexCTokenEvents() {
  while (1) {
    const bs = await prisma.blockSyncLending.findUniqueOrThrow({
      where: { id: "CToken" },
      select: { blockSynced: true },
    });
    const logs = await provider.send("eth_getLogs", [
      {
        fromBlock: "0x" + bs.blockSynced.toString(16),
        toBlock:
          "0x" + (bs.blockSynced + Config.canto.blockLookupWindow).toString(16),
        topics: [Object.values(Config.canto.contracts.cToken.topics)],
        address: Config.canto.contracts.cToken.addresses,
      },
    ]);

    for (let log of logs) {
      switch (log.topics[0]) {
        case Config.canto.contracts.cToken.topics.Borrow: {
          await handleBorrow(log);
          break;
        }
        case Config.canto.contracts.cToken.topics.RepayBorrow: {
          await handleRepayBorrow(log);
          break;
        }
        case Config.canto.contracts.cToken.topics.LiquidateBorrow: {
          await handleLiquidateBorrow(log);
          break;
        }
        case Config.canto.contracts.cToken.topics.AccrueInterest: {
          await handleAccrueInterest(log);
          break;
        }
        case Config.canto.contracts.cToken.topics.NewReserveFactor: {
          await handleNewReserveFactor(log);
          break;
        }
        case Config.canto.contracts.cToken.topics.Transfer: {
          await handleTransfer(log);
          break;
        }
        case Config.canto.contracts.cToken.topics.NewMarketInterestRateModel: {
          await handleNewMarketInterestRateModel(log);
          break;
        }
      }
    }

    const liveBlock = await provider.getBlockNumber();
    if (liveBlock < bs.blockSynced + Config.canto.blockLookupWindow) {
      await prisma.blockSyncLending.update({
        where: { id: "CToken" },
        data: { blockSynced: liveBlock },
      });
      break;
    }

    await prisma.blockSyncLending.update({
      where: { id: "CToken" },
      data: { blockSynced: bs.blockSynced + Config.canto.blockLookupWindow },
    });
  }
  console.log("sync complete: CToken");
}
