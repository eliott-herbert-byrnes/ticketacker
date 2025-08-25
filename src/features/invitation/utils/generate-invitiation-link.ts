import { emailInvitiationPath } from "@/app/paths";
import { prisma } from "@/lib/prisma";
import { generateRandomToken, hashToken } from "@/utils/crypto";
import { getBaseUrl } from "@/utils/url";

export const generateInvitationLink = async (
  invitedByUserId: string,
  organizationId: string,
  email: string
) => {
  await prisma.invitation.deleteMany({
    where: {
      email,
      organizationId,
    },
  });

  const tokenId = generateRandomToken();
  const tokenHash = hashToken(tokenId);

  await prisma.invitation.create({
    data: {
      tokenHash,
      invitedByUserId,
      organizationId,
      email,
    },
  });

  const pageUrl = getBaseUrl() + emailInvitiationPath();
  const emailInvitiationLink = pageUrl + `/${tokenId}`;

  return emailInvitiationLink;
};
