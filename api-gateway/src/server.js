const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const express = require("express");
const compression = require("compression");

const DEX_ENDPOINT = process.env.DEX_ENDPOINT;
const LENDING_ENDPOINT = process.env.LENDING_ENDPOINT;

const PORT = process.env.PORT || 8080;

async function apolloServerStart() {
  const app = express();

  // Compression
  app.use(compression());

  // Gateway
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "dex", url: DEX_ENDPOINT },
        { name: "lending", url: LENDING_ENDPOINT },
      ]
    })
  });

  const server = new ApolloServer({
    gateway,
    tracing: true,
    subscriptions: false,
  });

  await server.start();

  server.applyMiddleware({ app, cors: false, path: "/" });

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://0.0.0.0:${PORT}/`);
  });

  return { server, app };
}

apolloServerStart();
