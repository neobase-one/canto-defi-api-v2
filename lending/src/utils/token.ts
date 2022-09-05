import { TokenDefinition } from "./tokenDefinition";
import ERC20ABI from "../../abis/ERC20.json";
import { ethers } from "ethers";
import provider from "../provider";
import { ADDRESS_ZERO } from "./consts";
import { Config } from "../config";

export async function fetchTokenName (tokenAddress: string) {
  return fetchTokenSymbol(tokenAddress);
}

export async function fetchTokenSymbol(tokenAddress: string) {
  if (tokenAddress == ADDRESS_ZERO) {
    // default: canto
    return "CANTO";
  }

  if (tokenAddress == Config.canto.lendingDashboard.cW_CANTO_ADDRESS) {
    return "cwCANTO";
  }

  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress);
  if (staticDefinition != null) {
    return (staticDefinition as TokenDefinition).symbol;
  }

  const contract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
  var symbol = await contract.symbol();
  if (symbol == null) {
    symbol = "";
  }

  return symbol;
}

export async function fetchTokenTotalSupply(tokenAddress: string) {
  if (tokenAddress == ADDRESS_ZERO) {
    // default: canto
    return 100 * 1000000000 * 1000000000000000000; // 100 bil * (10**18)
  }

  const contract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
  var totalSupply = await contract.totalSupply();
  if (totalSupply == null) {
    totalSupply = 0;
  }

  return totalSupply;
}

export async function fetchTokenDecimals(tokenAddress: string) {
  if (tokenAddress == ADDRESS_ZERO) {
    // default: canto
    return 18;
  }

  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress);
  if (staticDefinition != null) {
    return (staticDefinition as TokenDefinition).decimals;
  }

  const contract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
  var tokenDecimals = await contract.decimals();
  if (tokenDecimals == null) {
    tokenDecimals = 18;
  }

  return tokenDecimals;
}
