export class NotAuthorizedError extends Error {}
export class RevokedCredentialError extends Error {}
export class MissingScopeError extends Error {}

import * as credentialData from "@/features/credentials/data";
import { hashToken } from "@/utils/crypto";

export const authenticateCredential = async (args: {
  token: string;
  organizationId: string;
  requiredScopes?: string | string[];
}) => {
  const { token, organizationId, requiredScopes } = args;

  if (!token) throw new NotAuthorizedError("Missing token");

  const secretHash = hashToken(token);

  const credential = await credentialData.findUniqueCredential(
    secretHash,
    organizationId
  );

  if (!credential) throw new NotAuthorizedError("Invalid credentials");

  if (credential.revokedAt) {
    throw new RevokedCredentialError("Credential revoked");
  }

  if (requiredScopes) {
    const needed = Array.isArray(requiredScopes)
      ? requiredScopes
      : [requiredScopes];

    const have = new Set(credential.scopes.map((s) => s.scope));
    const missing = needed.filter((s) => !have.has(s));

    if (missing.length) {
      throw new MissingScopeError(
        `Missing required scope(s): ${missing.join(", ")}`
      );
    }

    if ("touchedLastUsed" in credentialData) {
      await credentialData.touchLastUsed(credential.id);
    }
  }

  return credential;
};
