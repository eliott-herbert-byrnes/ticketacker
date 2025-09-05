import { generateRandomToken, hashToken } from "@/utils/crypto";
import * as credentialData from "../data";

export const generateCredential = async (
  organizationId: string,
  name: string,
  userId: string | undefined
) => {
  const secret = generateRandomToken();
  const secretHash = hashToken(secret);

  await credentialData.createCredential(secretHash, organizationId, name, userId);

  return secret;
};
