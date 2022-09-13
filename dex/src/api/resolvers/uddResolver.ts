import { Prisma } from "@prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { OrderDirection, UniswapDayDatasInput } from "../schema/input";
import { StableswapDayData } from "../schema/stableswapDayData";

@Resolver()
export class UniswapDayDatasResolver {
  @Query(returns => [StableswapDayData])
  async uniswapDayDatas(@Arg("input") input: UniswapDayDatasInput) {
    
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