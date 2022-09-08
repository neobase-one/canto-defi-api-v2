import { providers } from "ethers";
import provider from "../provider";
import config from "../config";
import {
  handleBurn,
  handleMint,
  handleSwap,
  handleSync,
  handleTransfer,
} from "../eventHandlers/pair";

export async function indexPairEvents(from: number, to: number) {
  const logs: providers.Log[] = await provider.send("eth_getLogs", [
    {
      fromBlock: "0x" + from.toString(16),
      toBlock: "0x" + to.toString(16),
      topics: [Object.values(config.canto.contracts.baseV1Pair.topics)],
      address: config.canto.contracts.baseV1Pair.addresses,
    },
  ]);

  for (let log of logs) {
    switch (log.topics[0]) {
      case config.canto.contracts.baseV1Pair.topics["Transfer"]: {
        await handleTransfer(log);
        break;
      }
      case config.canto.contracts.baseV1Pair.topics["Sync"]: {
        await handleSync(log);
        break;
      }
      case config.canto.contracts.baseV1Pair.topics["Mint"]: {
        await handleMint(log);
        break;
      }
      case config.canto.contracts.baseV1Pair.topics["Burn"]: {
        await handleBurn(log);
        break;
      }
      case config.canto.contracts.baseV1Pair.topics["Swap"]: {
        await handleSwap(log);
        break;
      }
    }
  }
}
