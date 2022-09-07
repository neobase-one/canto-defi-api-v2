import { ethers, providers } from "ethers";
import prisma from "../prisma";
import provider from "../provider";
import config from "../config";
import { handleBurn, handleMint, handleSwap, handleSync, handleTransfer } from "../eventHandlers/pair";

export async function parsePairEvents() {
  while (1) {
  // for(var i = 0; i < 100; i++){
    const bs = await prisma.blockSync.findUniqueOrThrow({
      where: { id: "BaseV1Pair" },
      select: { blockSynced: true },
    });
    console.log("block: ", bs.blockSynced)
    const logs: providers.Log[] = await provider.send("eth_getLogs", [
      {
        fromBlock: "0x" + bs.blockSynced.toString(16),
        toBlock:
        "0x" + (bs.blockSynced + config.canto.blockLookupWindow).toString(16),
        topics: [Object.values(config.canto.contracts.baseV1Pair.topics)],
        address: config.canto.contracts.baseV1Pair.addresses
      },
    ]);
    
    for (let log of logs) {
      // console.log(log)
      switch(log.topics[0]) {
        // case config.canto.contracts.baseV1Pair.topics["Mint"]: {await handleMint(log); break;} 
        // case config.canto.contracts.baseV1Pair.topics["Burn"]: {await handleBurn(log); break;} 
        // case config.canto.contracts.baseV1Pair.topics["Swap"]: {await handleSwap(log); break;} 
        case config.canto.contracts.baseV1Pair.topics["Sync"]: {await handleSync(log); break;} 
        // case config.canto.contracts.baseV1Pair.topics["Transfer"]: {await handleTransfer(log); break;} 
      }
      console.log("parsed", log.transactionHash);
    }

    const liveBlock = await provider.getBlockNumber();
    if (liveBlock < bs.blockSynced + config.canto.blockLookupWindow) {
      await prisma.blockSync.update({
        where: { id: "BaseV1Pair" },
        data: { blockSynced: liveBlock },
      });
      break;
    }

    await prisma.blockSync.update({
      where: { id: "BaseV1Pair" },
      data: { blockSynced: bs.blockSynced + config.canto.blockLookupWindow },
    });
  }
  console.log("sync complete: BaseV1Pair");
}
