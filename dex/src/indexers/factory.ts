import { ethers, providers } from "ethers";
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
    console.log("block: ", bs.blockSynced)
    const logs: providers.Log[] = await provider.send("eth_getLogs", [
      {
        fromBlock: "0x" + bs.blockSynced.toString(16),
        toBlock:
          "0x" + (bs.blockSynced + config.canto.blockLookupWindow).toString(16),
        topics: [Object.values(config.canto.contracts.baseV1Factory.topics)],
        address: config.canto.contracts.baseV1Factory.addresses
      },
    ]);
    for (let log of logs) {
      switch(log.topics[0]) {
        case config.canto.contracts.baseV1Factory.topics["PairCreated"]: {await handlePairCreated(log); break;} 
      }
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
