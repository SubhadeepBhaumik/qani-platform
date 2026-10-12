-- CreateTable
CREATE TABLE "integration_connections" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "connectedByUserId" TEXT NOT NULL,
    "externalAccountId" TEXT,
    "scope" TEXT,
    "accessTokenEnc" TEXT NOT NULL,
    "refreshTokenEnc" TEXT NOT NULL,
    "accessExpiresAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastRefreshedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "integration_connections_connectedByUserId_idx" ON "integration_connections"("connectedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "integration_connections_provider_tenantId_key" ON "integration_connections"("provider", "tenantId");
