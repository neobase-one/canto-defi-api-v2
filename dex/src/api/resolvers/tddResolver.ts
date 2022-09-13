import { Prisma } from "@prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { OrderDirection, TokenDayDatasInput } from "../schema/input";
import { TokenDayData } from "../schema/tokenDayData";

@Resolver()
export class TokenDayDatasResolver {
  @Query(returns => [TokenDayData])
  async tokenDayDatas(@Arg("input") input: TokenDayDatasInput) {
    let od = (input.orderDirection == OrderDirection.ASC) ? Prisma.SortOrder.asc: Prisma.SortOrder.desc;
    if (input.date!== undefined) {
      const tokenDayDatas = await prisma.tokenDayData.findMany({
        where: {
          date: {
            gte: input.date
          },
        }, 
        orderBy: {
          [input.orderBy.trim()]: od
        },
        take: input.first,
        skip: input.skip
      });
      return tokenDayDatas;
    } else {
      const tokenDayDatas = await prisma.tokenDayData.findMany({
        where: {
          tokenId: input.tokenAddress,
        }, 
        orderBy: {
          [input.orderBy.trim()]: od
        },
        take: input.first,
        skip: input.skip
      }); 
      return tokenDayDatas;
    }
  }
}