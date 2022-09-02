import prisma from "./prisma";
import config from "./config";
import { indexComptrollerEvents } from "./indexers/comptoller";
import { indexCTokenEvents } from "./indexers/ctoken"

async function init() {
  await prisma.blockSyncLending.upsert({
    where: {
      id: "Comptroller",
    },
    update: {},
    create: {
      id: "Comptroller",
      blockSynced: config.canto.contracts.comptroller.startBlock,
    },
  });

  await prisma.blockSyncLending.upsert({
    where: {
      id: "CToken",
    },
    update: {},
    create: {
      id: "CToken",
      blockSynced: config.canto.contracts.cToken.startBlock,
    },
  });
}

async function main() {
  await init();
  console.log("setup completed, parsing now...\n");
  await indexComptrollerEvents()
  await indexCTokenEvents();
}

main();