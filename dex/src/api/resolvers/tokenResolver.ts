import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { TokenInput } from "../schema/input";
import { Token } from "../schema/token";

@Resolver()
export class TokensResolver {
  @Query(returns => [Token])
  async tokens(@Arg("input") input: TokenInput) {
    if (input.id_in!==undefined) {
      const tokens = await prisma.token.findMany({
        where: {
          id: {
            in: input.id_in
          },
          //   block: input.block
        }, 
        take: input.first,
        skip: input.skip
      });
      return tokens;
    } else {
      const tokens = await prisma.token.findMany({
        where: {
          id: {
            in: input.id_in
          },
          //   block: input.block
        }, 
        take: input.first,
        skip: input.skip
      });
      return tokens; 
    }
  }
}