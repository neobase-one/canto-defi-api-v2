import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { StableswapFactoriesInput } from "../schema/input";
import { StableswapFactory } from "../schema/stableswapFactory";

@Resolver()
export class StableswapFactoriesResolver {
  @Query(returns => [StableswapFactory])
  async stableswapFactories(@Arg("input") input: StableswapFactoriesInput) {
    if (input.block === undefined) {
      const factories = await prisma.stableswapFactory.findMany({
        where: {
          id: input.id
        }, 
      });
      console.log(factories)
      return factories;
    } else {
      const factories = await prisma.stableswapFactory.findMany({
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