import { ethers } from "ethers";
import prisma from "../prisma";
import provider from "../provider";
import config from "../config";
import { handlePairCreated } from "../eventHandlers/factory";

export async function parseFactoryEvents() {
  while (1) {
    const bs = await prisma.blockSync.findUniqueOrThrow({
      where: { id: "BaseV1Factory" },
      select: { blockSynced: true },
    });
    const logs = await provider.send("eth_getLogs", [
      {
        fromBlock: "0x" + bs.blockSynced.toString(16),
        toBlock:
          "0x" + (bs.blockSynced + config.canto.blockLookupWindow).toString(16),
        topics: [Object.values(config.canto.contracts.baseV1Factory.topics)],
      },
    ]);

    for (let log of logs) {
      if (
        log.topics[0] ==
        config.canto.contracts.baseV1Factory.topics["PairCreated"]
      )
        await handlePairCreated(log);

      console.log("parsed", log.transactionHash);
    }

    const liveBlock = await provider.getBlockNumber();
    if (liveBlock < bs.blockSynced + config.canto.blockLookupWindow) {
      await prisma.blockSync.update({
        where: { id: "BaseV1Factory" },
        data: { blockSynced: liveBlock },
      });
      break;
    }

    await prisma.blockSync.update({
      where: { id: "BaseV1Factory" },
      data: { blockSynced: bs.blockSynced + config.canto.blockLookupWindow },
    });
  }
  console.log("sync complete: BaseV1Factory");
}
