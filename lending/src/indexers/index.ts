import { Config } from "../config";
import prisma from "../prisma";
import provider from "../provider";
import { MAX_BLOCK_WINDOW_SIZE } from "../utils/consts";
import { indexComptrollerEvents } from "./comptoller";
import { indexCTokenEvents } from "./ctoken";

export async function indexChain() {
  while (1) {
    const bs = await prisma.blockSyncLending.findUniqueOrThrow({
      where: { id: "Lending" },
      select: { blockSynced: true },
    });

    // set block window
    let lastIndexedBlockNumber = bs.blockSynced;
    let chainBlockHead = await provider.getBlockNumber();

    let range = Math.min(Math.max(0, chainBlockHead - lastIndexedBlockNumber), MAX_BLOCK_WINDOW_SIZE);

    if (range == 0) {
      // wait one block period & retry
      await new Promise(f => setTimeout(f, Config.canto.pollingDuration * 1000));
      continue;
    }

    let start = lastIndexedBlockNumber;
    let end = start + range;

    // INDEX LENDING 
    console.log("LENDING", start, end);
    
    // comptroller
    await indexComptrollerEvents(start, end);

    // cToken
    await indexCTokenEvents(start, end);

    // update last indexed block
    await prisma.blockSyncLending.update({
      where: { id: "Lending" },
      data: { blockSynced: end },
    });
  }
}

