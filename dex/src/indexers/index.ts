import { indexFactoryEvents } from "./factory";
import { indexPairEvents } from "./pair";
import prisma from "../prisma";
import config from "../config";
import provider from "../provider";
import { exit } from "process";

export async function indexChain() {
  while (1) {
    const bs = await prisma.blockSync.findUniqueOrThrow({
      where: { id: '1' },
      select: { blockNumber: true },
    });

    const from = bs.blockNumber
    const to = from + config.canto.blockLookupWindow
    console.log(`block: `, from, to);

    // factory
    await indexFactoryEvents(from, to);
    // pair
    await indexPairEvents(from, to);

    const liveBlock = await provider.getBlockNumber();
    if (liveBlock < bs.blockNumber + config.canto.blockLookupWindow) {
      await prisma.blockSync.update({
        where: { id: "1" },
        data: { blockNumber: liveBlock },
      });
      break;
    }

    await prisma.blockSync.update({
      where: { id: "1" },
      data: { blockNumber: {increment: config.canto.blockLookupWindow }},
    });
  }
  console.log("sync complete")
  exit()
}