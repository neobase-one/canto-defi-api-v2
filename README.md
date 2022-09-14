# canto-deli-api-v2

Indexer + GraphQL API for Canto Dex and Lending contracts

## Requirements

### NVM 16.0

```sh
nvm install 16.0
nvm use 16.0
```
__NOTE__: `16.10` for api-gateway

### DB

- postgres 14.0
- redis

### API

- apollo graphql

### Web3

- ethers.js

### Deployment

- docker-compose
- nginx - https


## Deployment

1. Db Migration in `dex` and `lending`
  ```
  prisma migrate deploy
  ```
2. Run docker-compose
  ```
  docker compose up -d
  ```
