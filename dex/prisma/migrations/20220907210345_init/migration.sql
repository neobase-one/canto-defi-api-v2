-- CreateTable
CREATE TABLE "BlockSync" (
    "id" TEXT NOT NULL,
    "blockSynced" INTEGER NOT NULL,

    CONSTRAINT "BlockSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StableswapFactory" (
    "id" TEXT NOT NULL,
    "pairCount" INTEGER NOT NULL DEFAULT 0,
    "totalVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalVolumeETH" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "untrackedVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalLiquidityUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalLiquidityETH" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "txCount" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "StableswapFactory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" BIGINT NOT NULL,
    "totalSupply" BIGINT NOT NULL,
    "tradeVolume" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tradeVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "untrackedVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "txCount" BIGINT NOT NULL DEFAULT 0,
    "totalLiquidity" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "derivedETH" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" TEXT NOT NULL,
    "token0Id" TEXT NOT NULL,
    "token1Id" TEXT NOT NULL,
    "reserve0" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reserve1" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalSupply" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reserveETH" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reserveUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "trackedReserveETH" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "token0Price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "token1Price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "volumeToken0" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "volumeToken1" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "volumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "untrackedVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "txCount" BIGINT NOT NULL DEFAULT 0,
    "createdAtTimestamp" BIGINT NOT NULL,
    "createdAtBlockNumber" BIGINT NOT NULL,
    "liquidityProviderCount" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "usdSwapped" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidityPosition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "liquidityTokenBalance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "LiquidityPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidityPositionSnapshot" (
    "id" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "block" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "token0PriceUSD" DECIMAL(65,30) NOT NULL,
    "token1PriceUSD" DECIMAL(65,30) NOT NULL,
    "reserve0" DECIMAL(65,30) NOT NULL,
    "reserve1" DECIMAL(65,30) NOT NULL,
    "reserveUSD" DECIMAL(65,30) NOT NULL,
    "liquidityTokenTotalSupply" DECIMAL(65,30) NOT NULL,
    "liquidityTokenBalance" DECIMAL(65,30) NOT NULL,
    "liquidityPositionId" TEXT NOT NULL,

    CONSTRAINT "LiquidityPositionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mint" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "pairId" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "liquidity" DECIMAL(65,30) NOT NULL,
    "sender" TEXT,
    "amount0" DECIMAL(65,30),
    "amount1" DECIMAL(65,30),
    "logIndex" BIGINT,
    "amountUSD" DECIMAL(65,30),
    "feeTo" TEXT,
    "feeLiquidity" DECIMAL(65,30),

    CONSTRAINT "Mint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Burn" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "pairId" TEXT NOT NULL,
    "liquidity" DECIMAL(65,30) NOT NULL,
    "sender" TEXT,
    "amount0" DECIMAL(65,30),
    "amount1" DECIMAL(65,30),
    "to" TEXT,
    "logIndex" BIGINT,
    "amountUSD" DECIMAL(65,30),
    "needsComplete" BOOLEAN NOT NULL,
    "feeTo" TEXT,
    "feeLiquidity" DECIMAL(65,30),

    CONSTRAINT "Burn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swap" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "pairId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "amount0In" DECIMAL(65,30) NOT NULL,
    "amount1In" DECIMAL(65,30) NOT NULL,
    "amount0Out" DECIMAL(65,30) NOT NULL,
    "amount1Out" DECIMAL(65,30) NOT NULL,
    "to" TEXT NOT NULL,
    "logIndex" BIGINT,
    "amountUSD" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Swap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "ethPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StableswapDayData" (
    "id" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "dailyVolumeETH" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyVolumeUntracked" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalVolumeETH" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalLiquidityETH" DECIMAL(65,30) NOT NULL,
    "totalVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalLiquidityUSD" DECIMAL(65,30) NOT NULL,
    "txCount" BIGINT NOT NULL,

    CONSTRAINT "StableswapDayData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairHourData" (
    "id" TEXT NOT NULL,
    "hourStartUnix" INTEGER NOT NULL,
    "pairId" TEXT NOT NULL,
    "reserve0" DECIMAL(65,30) NOT NULL,
    "reserve1" DECIMAL(65,30) NOT NULL,
    "totalSupply" DECIMAL(65,30) NOT NULL,
    "reserveUSD" DECIMAL(65,30) NOT NULL,
    "hourlyVolumeToken0" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "hourlyVolumeToken1" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "hourlyVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "hourlyTxns" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "PairHourData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairDayData" (
    "id" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "pairAddress" TEXT NOT NULL,
    "token0Id" TEXT NOT NULL,
    "token1Id" TEXT NOT NULL,
    "reserve0" DECIMAL(65,30) NOT NULL,
    "reserve1" DECIMAL(65,30) NOT NULL,
    "totalSupply" DECIMAL(65,30) NOT NULL,
    "reserveUSD" DECIMAL(65,30) NOT NULL,
    "dailyVolumeToken0" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyVolumeToken1" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyTxns" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "PairDayData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenDayData" (
    "id" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "tokenId" TEXT NOT NULL,
    "dailyVolumeToken" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyVolumeETH" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyVolumeUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "dailyTxns" BIGINT NOT NULL DEFAULT 0,
    "totalLiquidityToken" DECIMAL(65,30) NOT NULL,
    "totalLiquidityETH" DECIMAL(65,30) NOT NULL,
    "totalLiquidityUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "priceUSD" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "TokenDayData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidityPosition" ADD CONSTRAINT "LiquidityPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidityPosition" ADD CONSTRAINT "LiquidityPosition_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidityPositionSnapshot" ADD CONSTRAINT "LiquidityPositionSnapshot_liquidityPositionId_fkey" FOREIGN KEY ("liquidityPositionId") REFERENCES "LiquidityPosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidityPositionSnapshot" ADD CONSTRAINT "LiquidityPositionSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidityPositionSnapshot" ADD CONSTRAINT "LiquidityPositionSnapshot_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mint" ADD CONSTRAINT "Mint_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mint" ADD CONSTRAINT "Mint_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Burn" ADD CONSTRAINT "Burn_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Burn" ADD CONSTRAINT "Burn_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swap" ADD CONSTRAINT "Swap_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swap" ADD CONSTRAINT "Swap_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairHourData" ADD CONSTRAINT "PairHourData_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairDayData" ADD CONSTRAINT "PairDayData_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairDayData" ADD CONSTRAINT "PairDayData_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenDayData" ADD CONSTRAINT "TokenDayData_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
