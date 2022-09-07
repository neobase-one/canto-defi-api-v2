
import { ethers } from "ethers";
import { Arg, FieldResolver, Query, Resolver, Root, UnauthorizedError } from "type-graphql";
import prisma from "../../prisma";
import { DecimalScalar } from "../schema/decimalScalar";
import {
  OrderDirection,
  MarketsInput,
  MarketInput,
} from "../schema/input";
import { Market } from "../schema/market";
import cTokenABI from '../../../abis/CToken.json';
import provider from "../../provider";
import { Decimal } from "@prisma/client/runtime";
import { ONE_PD, DAYS_IN_YEAR_PD, HUNDRED_PD, SECONDS_IN_DAY_PD } from "../../utils/consts";
import { Config } from "../../config";
import { exponentToPD, orderDirection } from "../../utils/helper";
import { Prisma } from "@prisma/client";

@Resolver((of) => Market)
export class MarketResolver {
  // @Query((returns) => [Market])
  // async markets(@Arg("input") input: MarketsInput) {
  //   if (!(input.id == null)) {
  //     let sortBy = input.orderBy;
  //     if (input.orderDirection === OrderDirection.DES) {
  //       sortBy = "-" + sortBy.trim;
  //     }
  //     const val = await MarketModel.find({ id: input.id }).sort(sortBy).exec();
  //     let result: Market[] = [];
  //     for (var marketDb of val) {
  //       let market = await marketDb.toGenerated();
  //       result.push(market);
  //     }
  //     return result;
  //   } else {
  //     let sortBy = input.orderBy;
  //     if (input.orderDirection === OrderDirection.DES) {
  //       sortBy = "-" + sortBy.trim;
  //     }
  //     let limit = input.first;
  //     if (input.skip !== 0) {
  //       limit = limit + input.skip;
  //     }
  //     const val = await MarketModel.find().sort(sortBy).limit(limit).exec();
  //     let result: Market[] = [];
  //     for (var marketDb of val) {
  //       let market = await marketDb.toGenerated();
  //       result.push(market);
  //     }
  //     return result;
  //   }
  // }

  @Query((returns) => [Market])
  async markets(@Arg("input") input: MarketsInput) {
    let where = undefined
    console.log(input)
    if (input.id !== undefined) {
      where = {
        id: {
          in: input.id
        }
      }
    }
    let markets = await prisma.market.findMany({
        where: where,
        orderBy: marketsOrderBy(input),
        skip: input.skip,
        take: input.first
    });
    console.log(markets)

    // todo: APY based sorting for: supply, borrow

    return markets;
  }

  @Query((returns) => Market)
  async market(@Arg("input") input: MarketInput) {
    let market = await prisma.market.findUnique({
      where: {id: input.id}
    });

    return market;
  }

  @FieldResolver(returns => DecimalScalar)
  async supplyAPY(@Root() market: Market): Promise<Decimal> {
    return getSupplyAPY(market.id);
  }

  @FieldResolver(returns => DecimalScalar)
  async borrowAPY(@Root() market: Market): Promise<Decimal> {
    return getBorrowAPY(market.id);
  }
}

export async function getSupplyAPY(marketId: string) {
  let contract = new ethers.Contract(marketId, cTokenABI, provider);
  let ratePerBlock = await contract.supplyRatePerBlock();
  return calculateAPY(ratePerBlock);
}

export async function getBorrowAPY(marketId: string) {
  let contract = new ethers.Contract(marketId, cTokenABI, provider);
  let ratePerBlock = await contract.supplyRatePerBlock();
  return calculateAPY(ratePerBlock);
}

function calculateAPY(ratePerBlock: number): Decimal {
  // todo: verify formula
  let mantissa_factor = Config.canto.lendingDashboard.MANTISSA_FACTOR;
  let block_time = Config.canto.BLOCK_TIME;
  let blocksPerDay = SECONDS_IN_DAY_PD.div(block_time);
  let mantissa = exponentToPD(mantissa_factor);
  let denom = mantissa;
  // let denom = mantissa.times(blockPerDay);
  let frac = new Decimal(ratePerBlock.toString()).times(blocksPerDay).div(denom);
  let a = frac.plus(ONE_PD);
  let b = a.pow(DAYS_IN_YEAR_PD)
  let c = b.minus(ONE_PD);

  // calculate apy
  let apy = c.times(HUNDRED_PD);
  
  return apy;
}

function marketsOrderBy(input: MarketsInput) {
  let orderBy = input.orderBy;
  if (orderBy == null) {
    return undefined;
  } else {
    let od = orderDirection(input.orderDirection);

    let obj: Prisma.MarketOrderByWithRelationInput;
    if (orderBy === "totalSupply") {
      obj = {
        totalSupply: od
      }
    } else {
      // (orderBy == "totalBorrows")
      obj = {
        totalBorrows: od
      }
    }

    // Prisma.
    return obj;
  }
}

