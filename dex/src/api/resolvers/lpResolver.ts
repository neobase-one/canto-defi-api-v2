import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { LiquidityPositionsInput } from "../schema/input";
import { LiquidityPosition } from "../schema/liquidityPosition";

@Resolver()
export class LiquidityPositionsResolver {
    @Query(returns => [LiquidityPosition])
    async liquidityPositions(@Arg("input") input: LiquidityPositionsInput) {
        const lps = prisma.liquidityPosition.findMany( {where: {userId: input.user}})
        return lps;
    }
}