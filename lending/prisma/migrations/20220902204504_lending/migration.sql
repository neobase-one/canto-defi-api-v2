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
    "accrualBlockNumber" DECIMAL(65,30) NOT NULL,
    "totalSupply" DECIMAL(65,30) NOT NULL,
    "exchangeRate" DECIMAL(65,30) NOT NULL,
    "totalReserves" DECIMAL(65,30) NOT NULL,
    "totalCash" DECIMAL(65,30) NOT NULL,
    "totalDeposits" DECIMAL(65,30) NOT NULL,
    "totalBorrows" DECIMAL(65,30) NOT NULL,
    "perBlockBorrowInterest" DECIMAL(65,30) NOT NULL,
    "perBlockSupplyInterest" DECIMAL(65,30) NOT NULL,
    "borrowIndex" DECIMAL(65,30) NOT NULL,
    "tokenPerEthRatio" DECIMAL(65,30) NOT NULL,
    "tokenPerUSDRatio" DECIMAL(65,30) NOT NULL,
    "borrowRate" DECIMAL(65,30) NOT NULL,
    "cash" DECIMAL(65,30) NOT NULL,
    "collateralFactor" DECIMAL(65,30) NOT NULL,
    "interestRateModelAddress" TEXT NOT NULL,
    "numberOfBorrowers" DECIMAL(65,30) NOT NULL,
    "numberOfSuppliers" DECIMAL(65,30) NOT NULL,
    "reserves" DECIMAL(65,30) NOT NULL,
    "supplyRate" DECIMAL(65,30) NOT NULL,
    "underlyingAddress" TEXT NOT NULL,
    "underlyingName" TEXT NOT NULL,
    "underlyingPrice" DECIMAL(65,30) NOT NULL,
    "underlyingSymbol" TEXT NOT NULL,
    "blockTimestamp" DECIMAL(65,30) NOT NULL,
    "reserveFactor" DECIMAL(65,30) NOT NULL,
    "underlyingPriceUSD" DECIMAL(65,30) NOT NULL,
    "underlyingDecimals" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);
