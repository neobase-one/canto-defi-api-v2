import dotenv from "dotenv";

import BaseV1PairABI from "../abis/BaseV1Pair.json";
import BaseV1FactoryABI from "../abis/BaseV1Factory.json";
import { ethers } from "ethers";
import { Decimal } from "@prisma/client/runtime";

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
    startBlock: 85427,

    MINIMUM_LIQUIDITY_THRESHOLD_ETH: new Decimal("2"),
    MINIMUM_USD_THRESHOLD_NEW_PAIRS: new Decimal("400000"),

    wCANTO_ADDRESS: "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B", //wCANTO
    NOTE_CANTO_PAIR: "0x1D20635535307208919f0b67c3B2065965A85aA9", // token1 = wCANTO
    CANTO_ETH_PAIR: "0x216400ba362d8FCE640085755e47075109718C8B", // token1 = wCANTO
    CANTO_ATOM_PAIR: "0x30838619C55B787BafC3A4cD9aEa851C1cfB7b19", // token0 = wCANTO
    NOTE_USDC_PAIR: "0x9571997a66D63958e1B3De9647C22bD6b9e7228c", // token1 = USDC
    NOTE_USDT_PAIR: "0x35DB1f3a6A6F07f82C76fCC415dB6cFB1a7df833", // token1 = USDT

    // token where amounts should contribute to tracked volume and liquidity
    WHITELIST: [
      "0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503", // NOTE
      "0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd", // USDC
      "0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75", // USDT
      "0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265", // ATOM
      "0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687", // ETH
      "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B", // wCANTO
    ],

    UNTRACKED_PAIRS: [
    ],

    contracts: {
      baseV1Factory: {
        addresses: ["0xE387067f12561e579C5f7d4294f51867E0c1cFba"], // 224994
        abi: BaseV1FactoryABI,
        interface: new ethers.utils.Interface(BaseV1FactoryABI),
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
        topics: {
          Transfer: ethers.utils.id("Transfer(address,address,uint256)"),
          Sync: ethers.utils.id("Sync(uint256,uint256)"),
          Mint: ethers.utils.id("Mint(address,uint256,uint256)"),
          Burn: ethers.utils.id("Burn(address,uint256,uint256,address)"),
          Swap: ethers.utils.id("Swap(address,uint256,uint256,uint256,uint256,address)"),
        },
      },
    },
  },
};

export default config;
