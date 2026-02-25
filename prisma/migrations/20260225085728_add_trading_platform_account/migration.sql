-- CreateEnum
CREATE TYPE "TradingPlatform" AS ENUM ('MT4', 'MT5', 'CTRADER', 'MATCHTRADER', 'DXTRADE', 'TRADOVATE', 'NINJATRADER');

-- CreateTable
CREATE TABLE "TradingPlatformAccount" (
    "id" TEXT NOT NULL,
    "tradingAccountId" TEXT NOT NULL,
    "platform" "TradingPlatform" NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "server" TEXT,
    "apiKey" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "login" TEXT,
    "passwordEnc" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingPlatformAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TradingPlatformAccount_tradingAccountId_key" ON "TradingPlatformAccount"("tradingAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "TradingPlatformAccount_externalAccountId_key" ON "TradingPlatformAccount"("externalAccountId");

-- CreateIndex
CREATE INDEX "TradingPlatformAccount_platform_idx" ON "TradingPlatformAccount"("platform");

-- CreateIndex
CREATE INDEX "TradingPlatformAccount_status_idx" ON "TradingPlatformAccount"("status");

-- AddForeignKey
ALTER TABLE "TradingPlatformAccount" ADD CONSTRAINT "TradingPlatformAccount_tradingAccountId_fkey" FOREIGN KEY ("tradingAccountId") REFERENCES "TradingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
