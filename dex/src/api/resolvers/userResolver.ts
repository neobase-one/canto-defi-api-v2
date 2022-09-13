import { Arg, Query, Resolver } from "type-graphql";
import prisma from "../../prisma";
import { UsersInput } from "../schema/input";
import { User } from "../schema/user";

@Resolver()
export class UsersResolver {
  @Query(returns => [User])
  async users(@Arg("input") input: UsersInput) {
    if (input.block!==undefined) {
      const users = await prisma.user.findMany({
        where: {
          id: input.id,
        }, 
      });
      return users;
    } else {
      const users = await prisma.user.findMany({
        where: {
          id: input.id,
          //   block: {lte: input.block}
        }, 
      });
      return users;
    }
  }
}
