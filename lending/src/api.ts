import express from "express";
import apolloLoader from "./loaders/apollo";
import "reflect-metadata";
import { Config } from "./config";

async function main() {
  const app = express();

  let server = await apolloLoader();

  await server.start();

  server.applyMiddleware({
    app,
    path: Config.api.prefix,
  });

  console.log("API ENABLED");
  app.listen({ port: Config.port }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${Config.port}${Config.api.prefix}`
    )
  );
}

main();
