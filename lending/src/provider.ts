import { ethers } from "ethers";
import { Config } from "./config";

const provider = new ethers.providers.WebSocketProvider(Config.rpcUrl);
console.log("provider configured");

export default provider;
