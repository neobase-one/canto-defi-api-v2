import provider from "../provider";

export async function getBlockTimestamp(blockNumber: number) {
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}
