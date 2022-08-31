# Indexer Prototype

Indexes `PairCreated` event from `BaseV1Factory` contract.

### Running instructions

1. Run postgresql

```bash
docker rm -f postgresql && docker run --name postgresql -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=db -p 5432:5432 -d postgres
```

2. Copy sample variable file and update environment variables

```bash
cp env.example .env
```

3. Run migrations on the db

```bash
npx prisma migrate dev
```

4. Run indexer

```bash
npx ts-node src/index.ts
```
