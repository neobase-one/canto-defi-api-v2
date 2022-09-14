import { StableswapDayData } from "../schema/stableswapDayData";
import { BundlesResolver } from "./bundleResolver";
import { BurnResolver } from "./burnResolver";
import { StableswapFactoryResovler } from "./factoryResolver";
import { HealthResolver } from "./healthResolver";
import { LiquidityPositionsResolver } from "./lpResolver";
import { MintResolver } from "./mintResolver";
import { PairsResolver } from "./pairResolver";
import { LiquidityPositionSnapshotsResolver } from "./snapshotResolver";
import { SwapResolver } from "./swapResolver";
import { TokenDayDatasResolver } from "./tddResolver";
import { TokensResolver } from "./tokenResolver";
import { TransactionsResolver } from "./transactionResolver";
import { StableswapDayDatasResolver } from "./sddResolver";
import { StableswapFactoriesResolver } from "./stableswapFactoriesResolver";
import { UsersResolver } from "./userResolver";
import 'reflect-metadata';

export const resolvers: [Function, ...Function[]] = [
  BundlesResolver,
  BurnResolver,
  StableswapFactoryResovler,
  HealthResolver,
  LiquidityPositionsResolver,
  MintResolver,
  PairsResolver,
  LiquidityPositionSnapshotsResolver,
  SwapResolver,
  TokenDayDatasResolver,
  TokensResolver,
  TransactionsResolver,
  StableswapDayDatasResolver,
  StableswapFactoriesResolver,
  UsersResolver
];