import { ethers } from "ethers";
import prisma from "../prisma";
import provider from "../provider";
import config from "../config";

export async function parsePairEvents() {
  console.log("inside PAIR parser");

  while (1) {
    const bs = await prisma.blockSync.findUniqueOrThrow({
      where: { id: "BaseV1Pair" },
      select: { blockSynced: true },
    });

    const logs = await provider.send("eth_getLogs", [
      {
        fromBlock: "0x" + bs.blockSynced.toString(16),
        toBlock:
          "0x" + (bs.blockSynced + config.canto.blockLookupWindow).toString(16),
        topics: [Object.values(config.canto.contracts.baseV1Pair.topics)],
        addresses: config.canto.contracts.baseV1Pair.addresses,
      },
    ]);

    const contract = new ethers.Contract(
      config.canto.contracts.baseV1Pair.addresses[0],
      config.canto.contracts.baseV1Pair.abi,
      provider.getSigner(0)
    );

    await prisma.blockSync.update({
      where: { id: "BaseV1Pair" },
      data: { blockSynced: bs.blockSynced + config.canto.blockLookupWindow },
    });
    console.log("pair bs:", bs.blockSynced, logs.length);
  }
  //   for (let log of logs) {
  // console.log(contract.interface.parseLog(log))
  //   }
}
