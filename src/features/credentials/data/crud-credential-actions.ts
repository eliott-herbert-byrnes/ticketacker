import { prisma } from "@/lib/prisma";

const DEFAULT_SCOPES = ["delete:ticket"];

export const createCredential = async (
  secretHash: string,
  organizationId: string,
  name: string,
  userId: string | undefined
) => {
  return await prisma.credential.create({
    data: {
      secretHash,
      organizationId,
      name,
      createdByUserId: userId ?? null,
      scopes: {
        create: DEFAULT_SCOPES.map((s) => ({ scope: s })),
      },
    },
    select: { id: true },
  });
};

export const findCredential = async (id: unknown, organizationId: string) => {
  if (typeof id !== "string" || !id) return null;
  return await prisma.credential.findFirst({
    where: { id, organizationId },
    select: { createdAt: true, revokedAt: true },
  });
};

export const findUniqueCredential = async (
  secretHash: string,
  organizationId: string
) => {
  return await prisma.credential.findUnique({
    where: {
      secretHash,
      organizationId,
    },
    select: {
      id: true,
      organizationId: true,
      createdAt: true,
      revokedAt: true,
      scopes: { select: { scope: true } },
    },
  });
};

export const addScopesToCredential = async (
  credentialId: string,
  scopes: string[]
) => {
  if (!scopes.length) return;
  await prisma.credentialScope.createMany({
    data: scopes.map((s) => ({ credentialId, scope: s })),
    skipDuplicates: true,
  });
};

export const touchLastUsed = async (id: string) => {
  await prisma.credential.update({
    where: { id },
    data: { lastUsed: new Date() },
    select: { id: true },
  });
};
