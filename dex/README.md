# Indexer Prototype

Indexes `PairCreated` event from `BaseV1Factory` contract.

### Running instructions

1. Copy sample variable file and update environment variables
```bash
cp env.example .env
```

2. Run migrations on the db
```bash
npx prisma migrate dev
```

3. Run indexer
```bash
npx ts-node src/index.ts
```