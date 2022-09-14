import { Prisma } from "@prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { OrderDirection, StableswapDayDatasInput } from "../schema/input";
import { StableswapDayData } from "../schema/stableswapDayData";

@Resolver()
export class StableswapDayDatasResolver {
  @Query(returns => [StableswapDayData])
  async uniswapDayDatas(@Arg("input") input: StableswapDayDatasInput) {
    
    let od = (input.orderDirection == OrderDirection.ASC) ? Prisma.SortOrder.asc: Prisma.SortOrder.desc;
    const udds = await prisma.stableswapDayData.findMany({
      where: {
        date: {
          gte: input.startTime
        }
      }, 
      orderBy: {
        [input.orderBy.trim()]: od
      },
      take: input.first,
      skip: input.skip
    });
    return udds;
  }
}