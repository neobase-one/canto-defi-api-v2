import { ethers } from "ethers";
import config from "./config";

const provider = new ethers.providers.WebSocketProvider(config.rpcUrl);
console.log("provider configured");

export default provider;
