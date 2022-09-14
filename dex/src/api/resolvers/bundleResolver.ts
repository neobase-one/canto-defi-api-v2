import { Arg, Query, Resolver } from "type-graphql";
import { Bundle } from "../schema/bundle";
import prisma from "../../prisma";
import { BundlesInput } from "../schema/input";

@Resolver()
export class BundlesResolver {
    @Query(returns => [Bundle])
    async bundles(@Arg("input") input: BundlesInput) {
        const bundle = prisma.bundle.findUnique( {where: {id: input.id}})
        return bundle;
    }
}