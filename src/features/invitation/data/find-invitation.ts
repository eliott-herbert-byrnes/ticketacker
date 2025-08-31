import { prisma } from "@/lib/prisma";

export const findInvitation = async (tokenHash: string) => {
  return await prisma.invitation.findUnique({
    where: {
      tokenHash,
    },
  });
};

export const findUser = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findEmailInvitiation = async (email: string, organizationId: string) => {
  return await prisma.invitation.findUnique({
    where: {
      invitationId: {
        email,
        organizationId,
      },
    },
  });
}