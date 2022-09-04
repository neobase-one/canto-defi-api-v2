import dotenv from "dotenv";

import { ethers } from "ethers";
import ComptrollerABI from "../abis/Comptroller.json";
import CTokenABI from "../abis/CToken.json";

// load env var
dotenv.config();

// default -> NODE_ENV: development
// process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const Config = {
  // database url
  databaseUrl: process.env.DATABASE_URL!,

  // rpc url (wss)
  rpcUrl: process.env.RPC_URL!,

  // canto
  canto: {
    blockTime: 5, // in seconds
    blockLookupWindow: 3,
    // lending dash needs all these
    lendingDashboard: {
      USDC_ADDRESS: "0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd",
      cUSDC_ADDRESS: "0x0dD6241bFE519fB1c1B654877b66311c355804c5",
      cETH_ADDRESS: "0x830b9849E7D79B92408a86A557e7baAACBeC6030",
      MANTISSA_FACTOR: 18,
      cTOKEN_DECIMALS: 8
    },
    contracts: {
      comptroller: {
        addresses: ["0x5E23dC409Fc2F832f83CEc191E245A191a4bCc5C"], // 224994 // use unitroller address
        startBlock: 224994,
        abi: ComptrollerABI,
        interface: new ethers.utils.Interface(ComptrollerABI),
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
          "0xEe602429Ef7eCe0a13e4FfE8dBC16e101049504C", // cNoteDelegator
          "0x0dD6241bFE519fB1c1B654877b66311c355804c5", // cUsdcDelegator
          "0xD7Ff6Ba11422D47Aeff3DAE08CC1Ff5F30975D80", // cUsdtDelegator
          "0x732Dcd6021fE992a935a26A6C5861312f0cBE5B2", // cAtomDelegator
          "0x830b9849E7D79B92408a86A557e7baAACBeC6030", // cEthDelegator
          "0xB65Ec550ff356EcA6150F733bA9B954b2e0Ca488", // cCanto
        ],
        startBlock: 224994,
        abi: CTokenABI,
        interface: new ethers.utils.Interface(CTokenABI),
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
