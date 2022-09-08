import { Decimal } from "@prisma/client/runtime"
import { buildSchema } from "type-graphql"
// import { resolvers } from "./resolvers"
// import { DecimalScalar } from "./schema/decimalScalar"
import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";


// ignore all this
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

export default async () => {
  // const schema = await buildSchema({
  //   resolvers: resolvers,
  //   emitSchemaFile: true,
  //   // scalarsMap: [
  //   //   { type: Decimal, scalar: DecimalScalar}
  //   // ],
  //   validate: false
  // });

  // const server = new ApolloServer({
  //   schema,
  //   plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  // });

  // ignore this too
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  
  return server;
}