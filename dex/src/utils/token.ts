import { TokenDefinition } from "./tokenDefinition";
import ERC20ABI from "../../abis/ERC20.json";
import { ethers } from "ethers";
import provider from "../provider";

export async function fetchTokenSymbol(tokenAddress: string) {
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
  const contract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
  var totalSupply = await contract.totalSupply();
  if (totalSupply == null) {
    totalSupply = 0;
  }

  return 0;
  return totalSupply;
}

export async function fetchTokenDecimals(tokenAddress: string) {
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

  return 18;
  return tokenDecimals;
}
