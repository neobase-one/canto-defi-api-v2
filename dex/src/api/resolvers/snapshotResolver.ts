import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { LiquidityPositionSnapshotsInput } from "../schema/input";
import { LiquidityPositionSnapshot } from "../schema/liquidityPositionSnapshot";

@Resolver()
export class LiquidityPositionSnapshotsResolver {
    @Query(returns => [LiquidityPositionSnapshot])
    async liquidityPositionSnapshots(@Arg("input") input: LiquidityPositionSnapshotsInput) {
        const lps = prisma.liquidityPositionSnapshot.findMany( {where: {userId: input.user}, skip: input.skip, take: input.first})
        return lps;
    }
}
