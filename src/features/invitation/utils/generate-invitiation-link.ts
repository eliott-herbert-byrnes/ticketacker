import { emailInvitiationPath } from "@/app/paths";
import { generateRandomToken, hashToken } from "@/utils/crypto";
import { getBaseUrl } from "@/utils/url";
import * as InvitationData from "../data";

export const generateInvitationLink = async (
  invitedByUserId: string,
  organizationId: string,
  email: string
) => {
  await InvitationData.deleteManyInvitation(email, organizationId);

  const tokenId = generateRandomToken();
  const tokenHash = hashToken(tokenId);

  await InvitationData.createInvitation(
    tokenHash,
    invitedByUserId,
    organizationId,
    email
  );

  const pageUrl = getBaseUrl() + emailInvitiationPath();
  const emailInvitiationLink = pageUrl + `/${tokenId}`;

  return emailInvitiationLink;
};
