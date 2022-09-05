-- CreateTable
CREATE TABLE "BlockSyncLending" (
    "id" TEXT NOT NULL,
    "blockSynced" INTEGER NOT NULL,

    CONSTRAINT "BlockSyncLending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "tokens" TEXT[],
    "countLiquidated" DECIMAL(65,30) NOT NULL,
    "liquidityTokenBalance" DECIMAL(65,30) NOT NULL,
    "countLiquidator" DECIMAL(65,30) NOT NULL,
    "hasBorrowed" BOOLEAN NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountCToken" (
    "id" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "transactionHashes" TEXT[],
    "transactionTimes" DECIMAL(65,30)[],
    "accrualBlockNumber" DECIMAL(65,30) NOT NULL,
    "enteredMarket" BOOLEAN NOT NULL,
    "cTokenBalance" DECIMAL(65,30) NOT NULL,
    "totalUnderlyingSupplied" DECIMAL(65,30) NOT NULL,
    "totalUnderlyingRedeemed" DECIMAL(65,30) NOT NULL,
    "accountBorrowIndex" DECIMAL(65,30) NOT NULL,
    "totalUnderlyingBorrowed" DECIMAL(65,30) NOT NULL,
    "totalUnderlyingRepaid" DECIMAL(65,30) NOT NULL,
    "storedBorrowBalance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "AccountCToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comptroller" (
    "id" TEXT NOT NULL,
    "priceOracle" TEXT NOT NULL,
    "closeFactor" DECIMAL(65,30) NOT NULL,
    "liquidationIncentive" DECIMAL(65,30) NOT NULL,
    "maxAssets" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Comptroller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "accrualBlockNumber" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalSupply" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalReserves" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalCash" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalDeposits" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalBorrows" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "perBlockBorrowInterest" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "perBlockSupplyInterest" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "borrowIndex" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tokenPerEthRatio" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tokenPerUSDRatio" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "borrowRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cash" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "collateralFactor" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "interestRateModelAddress" TEXT NOT NULL DEFAULT '0x0000000000000000000000000000000000000000',
    "numberOfBorrowers" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "numberOfSuppliers" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reserves" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "supplyRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "underlyingAddress" TEXT NOT NULL DEFAULT '0x0000000000000000000000000000000000000000',
    "underlyingName" TEXT NOT NULL,
    "underlyingPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "underlyingSymbol" TEXT NOT NULL,
    "blockTimestamp" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reserveFactor" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "underlyingPriceUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "underlyingDecimals" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);
