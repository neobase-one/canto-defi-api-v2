
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import prisma from "../../prisma";
import { DecimalScalar } from "../schema/decimalScalar";
import {
  OrderDirection,
  MarketsInput,
  MarketInput,
} from "../schema/input";
import { Market } from "../schema/market";

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

  // @Query((returns) => Market)
  // async market(@Arg("input") input: MarketInput) {
  //   const val = await MarketModel.findOne({ id: input.id }).exec();
  //   return val?.toGenerated();
  // }

  @Query((returns) => Market)
  async market(@Arg("input") input: MarketInput) {
    let market = await prisma.market.findUnique({
      where: {id: input.id}
    });

    return market;
  }

  // @FieldResolver(returns => DecimalScalar)
  // async supplyAPY(@Root() market: Market): Promise<Decimal> {
  //   // service
  //   let marketService = Container.get(MarketService);

  //   // return
  //   return marketService.getSupplyAPY(market.id);
  // }

  // @FieldResolver(returns => DecimalScalar)
  // async borrowAPY(@Root() market: Market): Promise<Decimal> {
  //   // service
  //   let marketService = Container.get(MarketService);

  //   // return
  //   return marketService.getBorrowAPY(market.id);
  // }
}
