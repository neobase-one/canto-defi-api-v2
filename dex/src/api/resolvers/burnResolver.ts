import { Prisma } from "@prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { Burn } from "../schema/burn";
import { BurnsInput, OrderDirection } from "../schema/input";

@Resolver()
export class BurnResolver {
  @Query(returns => [Burn])
  async burns(@Arg("input") input: BurnsInput) {
    if (input.pair_in !== undefined) {
      let od = (input.orderDirection == OrderDirection.ASC) ? Prisma.SortOrder.asc: Prisma.SortOrder.desc;
      const burns = await prisma.burn.findMany({
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
      return burns;
    } else if (input.pair !== undefined && input.to !== undefined) {
      const burns = await prisma.burn.findMany({where: {to: input.to, pairId: input.pair}})
      return burns;
    } else if (input.pair !== undefined && input.to === undefined) {
      const burns = await prisma.burn.findMany({where: {pairId: input.pair}})
      return burns;
    } else if (input.pair === undefined && input.to === undefined) {
      const burns = await prisma.burn.findMany({take: input.first})
      return burns;
    }
  }
}