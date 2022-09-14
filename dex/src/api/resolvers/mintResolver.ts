import { Prisma } from "@prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { Mint } from "../schema/mint";
import { MintsInput, OrderDirection } from "../schema/input";

@Resolver()
export class MintResolver {
  @Query(returns => [Mint])
  async mints(@Arg("input") input: MintsInput) {
    if (input.pair_in !== undefined) {
      let od = (input.orderDirection == OrderDirection.ASC) ? Prisma.SortOrder.asc: Prisma.SortOrder.desc;
      const mints = await prisma.mint.findMany({
        where: {
          pairId: {
            in: input.pair_in
          },
        }, 
        orderBy: {
          [input.orderBy.trim()]: od
        },
        take: input.first,
        include: {
          transaction: true,
          pair: true
        }
      });
      return mints;
    } else if (input.pair !== undefined && input.to !== undefined) {
      const mints = await prisma.mint.findMany({where: {to: input.to, pairId: input.pair}})
      return mints;
    } else if (input.pair !== undefined && input.to === undefined) {
      const mints = await prisma.mint.findMany({where: {pairId: input.pair}})
      return mints;
    } else if (input.pair === undefined && input.to === undefined) {
      const mints = await prisma.mint.findMany({take: input.first})
      return mints;
    }
  }
}