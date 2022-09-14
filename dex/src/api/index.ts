import "reflect-metadata"
import express from "express";
import apolloLoader from "./apollo";
import config from "../config"

async function main(){
    const app = express();

    let server = await apolloLoader();

    await server.start();

    server.applyMiddleware({
      app,
      path: config.api.prefix,
    });

    app.listen({ port: config.port }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${config.port}${config.api.prefix}`
      )
    );
}

main();