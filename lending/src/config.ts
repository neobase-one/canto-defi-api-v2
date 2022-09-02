import dotenv from "dotenv";

import { ethers } from "ethers";
import ComptrollerABI from "../abis/Comptroller.json";
import CTokenABI from "../abis/CToken.json";

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
    blockLookupWindow: 10000,

    contracts: {
      comptroller: {
        addresses: [], 
        abi: ComptrollerABI,
        interface: new ethers.utils.Interface(ComptrollerABI),
        startBlock: 85427,
        topics: {
          MarketListed: ethers.utils.id(
            "MarketListed(address)"
          ),
          MarketEntered: ethers.utils.id(
            "MarketEntered(address,address)"
          ),
          MarketExited: ethers.utils.id(
            "MarketExited(address,address)"
          ),
          NewCloseFactor: ethers.utils.id(
            "NewCloseFactor(uint256,uint256)"
          ),
          NewCollateralFactor: ethers.utils.id(
            "NewCollateralFactor(address,uint256,uint256)"
          ),
          NewLiquidationIncentive: ethers.utils.id(
            "NewLiquidationIncentive(uint256,uint256)"
          ),
          NewPriceOracle: ethers.utils.id(
            "NewPriceOracle(address,address)"
          )
        },
      },
      cToken: {
        addresses: [
          
        ],
        abi: CTokenABI,
        interface: new ethers.utils.Interface(CTokenABI),
        startBlock: 85427,
        topics: {
          Borrow: ethers.utils.id("Borrow(address,uint256,uint256,uint256)"),
          RepayBorrow: ethers.utils.id("RepayBorrow(address,address,uint256,uint256,uint256)"),
          LiquidateBorrow: ethers.utils.id(
            "LiquidateBorrow(address,address,uint256,address,uint256)"
          ),
          AccrueInterest: ethers.utils.id("AccrueInterest(uint256,uint256,uint256)"),
          NewReserveFactor: ethers.utils.id("NewReserveFactor(uint256,uint256)"),
          Transfer: ethers.utils.id("Transfer(indexed address,indexed address,uint256)"),
          NewMarketInterestRateModel: ethers.utils.id("NewMarketInterestRateModel(address,address)")
        },
      },
    },
  },
};

export default config;
