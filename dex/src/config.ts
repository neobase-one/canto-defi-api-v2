import dotenv from "dotenv";

import BaseV1PairABI from "../abis/BaseV1Pair.json";
import BaseV1FactoryABI from "../abis/BaseV1Factory.json";
import { ethers } from "ethers";

// load env var
dotenv.config();

// default -> NODE_ENV: development
// process.env.NODE_ENV = process.env.NODE_ENV || "development";

const config = {
  // database url
  databaseUrl: process.env.DATABASE_URL!,

  // rpc url (wss)
  rpcUrl: process.env.RPC_URL!,

  // canto
  canto: {
    blockTime: 5, // in seconds
    blockLookupWindow: 1000,

    contracts: {
      baseV1Factory: {
        addresses: ["0xE387067f12561e579C5f7d4294f51867E0c1cFba"], // 224994
        abi: BaseV1FactoryABI,
        interface: new ethers.utils.Interface(BaseV1FactoryABI),
        startBlock: 85427,
        topics: {
          PairCreated: ethers.utils.id(
            "PairCreated(address,address,bool,address,uint256)"
          ),
        },
      },
      baseV1Pair: {
        addresses: [
          "0x1D20635535307208919f0b67c3B2065965A85aA9", // note/canto
          "0x35DB1f3a6A6F07f82C76fCC415dB6cFB1a7df833", // note/usdt
          "0x9571997a66D63958e1B3De9647C22bD6b9e7228c", // note/usdc
          "0x216400ba362d8FCE640085755e47075109718C8B", // canto/eth
          "0x30838619C55B787BafC3A4cD9aEa851C1cfB7b19", // canto/atom
        ],
        abi: BaseV1PairABI,
        interface: new ethers.utils.Interface(BaseV1PairABI),
        startBlock: 85427,
        topics: {
          Mint: ethers.utils.id("Mint(address,uint256,uint256)"),
          Burn: ethers.utils.id("Burn(address,uint256,uint256,address)"),
          Swap: ethers.utils.id(
            "Swap(address,uint256,uint256,uint256,uint256,address)"
          ),
          Transfer: ethers.utils.id("Transfer(address,address,uint256)"),
          Sync: ethers.utils.id("Sync(uint256,uint256)"),
        },
      },
    },
  },
};

export default config;