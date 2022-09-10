import prisma from "./prisma";
import { Config } from "./config";
import { indexChain } from "./indexers";
import express from "express";
import apolloLoader from "./loaders/apollo";
import "reflect-metadata";

async function init() {
  await prisma.blockSyncLending.upsert({
    where: {
      id: "Comptroller",
    },
    update: {},
    create: {
      id: "Comptroller",
      blockSynced: Config.canto.contracts.comptroller.startBlock,
    },
  });

  await prisma.blockSyncLending.upsert({
    where: {
      id: "CToken",
    },
    update: {},
    create: {
      id: "CToken",
      blockSynced: Config.canto.contracts.cToken.startBlock,
    },
  });
}

async function main() {
  await init();
  console.log("setup completed\n");
  console.log("INDEXER ENABLED");

  await indexChain();
}

main();
