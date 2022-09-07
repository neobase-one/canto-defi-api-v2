import { parseFactoryEvents } from "./indexers/factory";
import { parsePairEvents } from "./indexers/pair";
import prisma from "./prisma";
import config from "./config";
import { exit } from "process";

async function init() {
  await prisma.blockSync.upsert({
    where: {
      id: "BaseV1Factory",
    },
    update: {},
    create: {
      id: "BaseV1Factory",
      blockSynced: config.canto.contracts.baseV1Factory.startBlock,
    },
  });

  await prisma.blockSync.upsert({
    where: {
      id: "BaseV1Pair",
    },
    update: {
      id: "BaseV1Pair",
      blockSynced: config.canto.contracts.baseV1Pair.startBlock,
    },
    create: {
      id: "BaseV1Pair",
      blockSynced: config.canto.contracts.baseV1Pair.startBlock,
    },
  });
}

async function main() {
  await init();
  console.log("setup completed, parsing now...\n");
  // await parseFactoryEvents();
  await parsePairEvents();
}

main();
