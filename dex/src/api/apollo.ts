import { Decimal } from "@prisma/client/runtime"
import { buildSchema } from "type-graphql"
import { resolvers } from "./resolvers"
import { DecimalScalar } from "./schema/decimalScalar"
import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

export default async () => {
  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: true,
    scalarsMap: [
      { type: Decimal, scalar: DecimalScalar}
    ],
    validate: false
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  return server;
}