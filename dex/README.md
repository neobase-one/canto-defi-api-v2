# Indexer Prototype

- Indexes `PairCreated` event from `BaseV1Factory` contract
- Indexes `Transfer` , `Sync`, `Mint`, `Burn`, `Swap`, events from `BaseV1Pair` contract

### Running instructions

1. Copy variable file

```bash
cp env.example .env
```

2. Run postgresql and migrate

```bash
docker rm -f postgresql && docker run --name postgresql -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=db -p 5432:5432 -d postgres && npx prisma migrate dev
```

3. Run indexer

```bash
npx ts-node src/index.ts
```
