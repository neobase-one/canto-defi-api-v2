import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { OrderDirection, SwapsInput } from "../schema/input";
import { Swap } from "../schema/swap";
import { Prisma } from "@prisma/client";

@Resolver()
export class SwapResolver {
  @Query(returns => [Swap])
  async swaps(@Arg("input") input: SwapsInput) {
    if (input.pair_in !== undefined) {
      let od = (input.orderDirection == OrderDirection.ASC) ? Prisma.SortOrder.asc: Prisma.SortOrder.desc;
      const swaps = await prisma.swap.findMany({
        where: {
          pairId: {
            in: input.pair_in
          },
        }, 
        orderBy: {
          [input.orderBy.trim()]: od
        },
        take: input.first 
      });
      return swaps;
    } else if (input.pair !== undefined) {
      const swaps = await prisma.swap.findMany({where: {pairId: input.pair}})
      return swaps;
    } else {
      const swaps = await prisma.swap.findMany({take: input.first})
      return swaps;
    }
  }
}