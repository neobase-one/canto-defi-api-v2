import { providers } from "ethers";
import provider from "../provider";
import config from "../config";
import { handlePairCreated } from "../eventHandlers/factory";

export async function indexFactoryEvents(from: number, to: number) {
  const logs: providers.Log[] = await provider.send("eth_getLogs", [
    {
      fromBlock: "0x" + from.toString(16),
      toBlock:
        "0x" + to.toString(16),
      topics: [Object.values(config.canto.contracts.baseV1Factory.topics)],
      address: config.canto.contracts.baseV1Factory.addresses,
    },
  ]);
  for (let log of logs) {
    switch (log.topics[0]) {
      case config.canto.contracts.baseV1Factory.topics["PairCreated"]: {
        await handlePairCreated(log);
        break;
      }
    }
  }
}
