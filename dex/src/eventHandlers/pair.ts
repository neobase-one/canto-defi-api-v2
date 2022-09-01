import { ethers } from "ethers";
import prisma from "../prisma";
import provider from "../provider";
import config from "../config";
import { Decimal } from "@prisma/client/runtime";
import {
  fetchTokenDecimals,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
} from "../utils/token";
import { getBlockTimestamp } from "../utils/helpers";

export async function handleMint(log: any) {
  console.log("mint")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
}

export async function handleBurn(log: any) {
  console.log("burn")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
}

export async function handleSwap(log: any) {
  console.log("swap")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
}

export async function handleSync(log: any) {
  console.log("sync")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
}

export async function handleTransfer(log: any) {
  console.log("transfer")
  const event = config.canto.contracts.baseV1Pair.interface.parseLog(log);
}
