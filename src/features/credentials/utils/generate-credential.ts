import { generateRandomToken, hashToken } from "@/utils/crypto";
import * as credentialData from "../data";

export const generateCredential = async (
  organizationId: string,
  name: string
) => {
  const secret = generateRandomToken();
  const secretHash = hashToken(secret);

  await credentialData.createCredential(secretHash, organizationId, name);

  return secret;
};
