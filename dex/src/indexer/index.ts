import prisma from "../prisma";
import config from "../config";

import provider from "../provider";
import { exit } from "process";
import {indexPairEvents} from "./pair"
import {indexFactoryEvents} from "./factory"

async function init() {
  await prisma.blockSync.upsert({
    where: {
      id: "1",
    },
    update: {
      // id: "1",
      // blockNumber: config.canto.startBlock,
    },
    create: {
      id: "1",
      blockNumber: config.canto.startBlock,
    },
  });
}

async function indexChain() {
  let polling = false;
  while (1) {
    if(polling){
      await new Promise(f => setTimeout(f, config.canto.pollingDuration*1000));
      console.log("polling...")
    }
    const liveBlock = await provider.getBlockNumber();

    const bs = await prisma.blockSync.findUniqueOrThrow({
      where: { id: "1" },
      select: { blockNumber: true },
    });

    const from = bs.blockNumber;
    const to = Math.min(from + config.canto.blockLookupWindow, liveBlock);
    console.log(`syncing block: ${from} to ${to}`);

    // factory
    await indexFactoryEvents(from, to);
    // pair
    await indexPairEvents(from, to);

    if (from + config.canto.blockLookupWindow > liveBlock) {
      polling = true
      // exit()
    }

    await prisma.blockSync.update({
      where: { id: "1" },
      data: { blockNumber: to },
    });
  }
  console.log("sync complete");
  exit();
}

async function main() {
  await init();
  console.log("setup completed, parsing now...\n");

  await indexChain();
}

main();
