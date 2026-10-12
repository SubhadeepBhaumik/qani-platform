import { PrismaClient } from '@prisma/client';
import { encryptField, decryptField, isEncryptedPayload } from './encryption.service';

// The ONLY path for reading/writing third-party OAuth tokens.
// Tokens are encrypted (AES-256-GCM) before they reach the database and are never logged.
const prisma = new PrismaClient();

export interface DecryptedTokens {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  externalAccountId: string | null;
  scope: string | null;
}

// Tenant key: the user's company when set, otherwise the user themselves.
export function tenantIdFor(user: { id: string; companyId?: string | null }): string {
  return user.companyId || user.id;
}

function sealed(plaintext: string): string {
  const payload = encryptField(plaintext);
  if (!isEncryptedPayload(payload)) throw new Error('Refusing to store a non-encrypted token');
  return payload;
}

export async function saveTokens(p: {
  provider: string;
  tenantId: string;
  connectedByUserId: string;
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  externalAccountId?: string | null;
  scope?: string | null;
}): Promise<void> {
  const data = {
    connectedByUserId: p.connectedByUserId,
    externalAccountId: p.externalAccountId ?? null,
    scope: p.scope ?? null,
    accessTokenEnc: sealed(p.accessToken),
    refreshTokenEnc: sealed(p.refreshToken),
    accessExpiresAt: new Date(Date.now() + p.expiresInSeconds * 1000),
    status: 'active',
    lastRefreshedAt: new Date(),
  };
  await prisma.integrationConnection.upsert({
    where: { provider_tenantId: { provider: p.provider, tenantId: p.tenantId } },
    create: { provider: p.provider, tenantId: p.tenantId, ...data },
    update: data,
  });
}

export async function getTokens(provider: string, tenantId: string): Promise<DecryptedTokens | null> {
  const row = await prisma.integrationConnection.findUnique({
    where: { provider_tenantId: { provider, tenantId } },
  });
  if (!row || row.status !== 'active') return null;
  return {
    accessToken: decryptField(row.accessTokenEnc),
    refreshToken: decryptField(row.refreshTokenEnc),
    accessExpiresAt: row.accessExpiresAt,
    externalAccountId: row.externalAccountId,
    scope: row.scope,
  };
}

// Disconnect: remove the stored tokens entirely (data minimisation).
export async function deleteConnection(provider: string, tenantId: string): Promise<void> {
  await prisma.integrationConnection.deleteMany({ where: { provider, tenantId } });
}
