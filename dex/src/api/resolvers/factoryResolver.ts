import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { StableswapFactoryInput } from "../schema/input";
import { StableswapFactory } from "../schema/stableswapFactory";

@Resolver()
export class StableswapFactoryResovler {
  @Query(returns => StableswapFactory)
  async stableswapFactory(@Arg("input") input: StableswapFactoryInput) {
    const factory = await prisma.stableswapFactory.findUnique( {where: {id: input.id}})
    return factory;
  }
}