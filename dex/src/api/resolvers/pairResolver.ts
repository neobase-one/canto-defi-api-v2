import { Prisma } from "@prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { OrderDirection, PairInput } from "../schema/input";
import { Pair } from "../schema/pair";


@Resolver()
export class PairsResolver {
  @Query(returns => [Pair])
  async getPairs(@Arg("input") input: PairInput) {
    let od = (input.orderDirection == OrderDirection.ASC) ? Prisma.SortOrder.asc: Prisma.SortOrder.desc;
    
    if (!input.block) {
      input.block = Math.max()
    }  
    const pairs = await prisma.pair.findMany({
      where: {
        OR: [
        {
          id: {
            in: input.id_in,
          },
          createdAtBlockNumber: { lte: input.block } 
        },
        {
          id: input.id,
          createdAtBlockNumber: { lte: input.block } 
        }
      ]
      }, 
      orderBy: {
        [input.orderBy.trim()]: od
      },
      skip: input.skip,
      take: input.first,
      include: {token0: true, token1: true}
    }) 

    return pairs;
  }
}