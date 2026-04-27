-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupplierProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "baseWalletAddress" TEXT NOT NULL,
    "listingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupplierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TraceListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierProfileId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL,
    "priceUsd" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TraceListing_supplierProfileId_fkey" FOREIGN KEY ("supplierProfileId") REFERENCES "SupplierProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListingTool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "ListingTool_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "TraceListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TraceAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "samplePreview" TEXT NOT NULL,
    "formatVersion" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TraceAsset_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "TraceListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buyerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "amountUsd" DECIMAL NOT NULL,
    "paymentTxHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Purchase_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "TraceListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccessGrant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "purchaseId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "grantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "AccessGrant_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AccessGrant_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AccessGrant_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "TraceAsset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProfile_userId_key" ON "SupplierProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TraceListing_slug_key" ON "TraceListing"("slug");

-- CreateIndex
CREATE INDEX "TraceListing_domain_taskType_idx" ON "TraceListing"("domain", "taskType");

-- CreateIndex
CREATE INDEX "TraceListing_sourceType_verificationStatus_idx" ON "TraceListing"("sourceType", "verificationStatus");

-- CreateIndex
CREATE INDEX "ListingTool_value_idx" ON "ListingTool"("value");

-- CreateIndex
CREATE UNIQUE INDEX "TraceAsset_listingId_key" ON "TraceAsset"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_paymentTxHash_key" ON "Purchase"("paymentTxHash");

-- CreateIndex
CREATE INDEX "Purchase_buyerId_createdAt_idx" ON "Purchase"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "AccessGrant_buyerId_expiresAt_idx" ON "AccessGrant"("buyerId", "expiresAt");

-- CreateIndex
CREATE INDEX "AccessGrant_assetId_expiresAt_idx" ON "AccessGrant"("assetId", "expiresAt");
