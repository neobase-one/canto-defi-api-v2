import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { UniswapFactoriesInput } from "../schema/input";
import { StableswapFactory } from "../schema/stableswapFactory";

@Resolver()
export class UniswapFactoriesResolver {
  @Query(returns => [StableswapFactory])
  async uniswapFactories(@Arg("input") input: UniswapFactoriesInput) {
    if (input.block === undefined) {
      const factories = await prisma.stableswapDayData.findMany({
        where: {
          id: input.id
        }, 
      });
      console.log(factories)
      return factories;
    } else {
      const factories = await prisma.stableswapDayData.findMany({
        where: {
          id: input.id,
          //   block: {lte: input.block}
        }, 
      });
      console.log(factories)
      console.log(factories)
      return factories;
    }
  }
}