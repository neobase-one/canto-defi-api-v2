import dotenv from "dotenv";

import { ethers } from "ethers";
import ComptrollerABI from "../abis/Comptroller.json";
import CTokenABI from "../abis/CToken.json";

// load env var
dotenv.config();

// default -> NODE_ENV: development
// process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const Config = {
  // server port
  port: parseInt(process.env.PORT || "8080"),

  // api conf
  api: {
    prefix: "/",
  },
  
  // database url
  databaseUrl: process.env.DATABASE_URL!,

  // rpc url (wss)
  rpcUrl: process.env.RPC_URL!,

  // indexer
  indexer: process.env.INDEXER_ENABLED || false,

  // canto
  canto: {
    BLOCK_TIME: 5, // in seconds
    blockLookupWindow: 300,
    // lending dash needs all these
    lendingDashboard: {
      USDC_ADDRESS: "0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd",
      cUSDC_ADDRESS: "0x0dD6241bFE519fB1c1B654877b66311c355804c5",
      cETH_ADDRESS: "0x830b9849E7D79B92408a86A557e7baAACBeC6030",
      cCANTO_ADDRESS: "0xB65Ec550ff356EcA6150F733bA9B954b2e0Ca488",
      cW_CANTO_ADDRESS: "0x5e23dc409fc2f832f83cec191e245a191a4bcc5c",
      wCANTO_ADDRESS: "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B",
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
          // erc20 cToken
          "0xEe602429Ef7eCe0a13e4FfE8dBC16e101049504C", // cNoteDelegator // todo: no MarketListed event
          "0xdE59F060D7ee2b612E7360E6C1B97c4d8289Ca2e", // cUsdcDelegator
          "0x6b46ba92d7e94FfA658698764f5b8dfD537315A9", // cUsdtDelegator
          "0x617383F201076e7cE0f6E625D1a983b3D1bd277A", // cAtomDelegator
          "0x830b9849E7D79B92408a86A557e7baAACBeC6030", // cEthDelegator
          "0xB65Ec550ff356EcA6150F733bA9B954b2e0Ca488", // cCanto
          // LP cToken
          "0x3C96dCfd875253A37acB3D2B102b6f328349b16B", // cCanto/Note
          "0xb49A395B39A0b410675406bEE7bD06330CB503E3", // cCanto/Eth
          "0xC0D6574b2fe71eED8Cd305df0DA2323237322557", // cCanto/Atom
          "0xD6a97e43FC885A83E97d599796458A331E580800", // cNote/Usdc
          "0xf0cd6b5cE8A01D1B81F1d8B76643866c5816b49F", // cNote/Usdt
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
      baseV1Router: {
        addresses: ["0x8fa61F21Fb514d2914a48B29810900Da876E295b"]
      }
    },
  },
};
