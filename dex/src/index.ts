import { indexChain } from "./indexers";
import prisma from "./prisma";
import config from "./config";

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

async function main() {
  await init();
  console.log("setup completed, parsing now...\n");

  await indexChain();
}

main();
