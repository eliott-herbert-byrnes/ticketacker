import { prisma } from "@/lib/prisma";

export const acceptInvitationForExistingUser = async (
  tokenHash: string,
  organizationId: string,
  userId: string
) => {
  return await prisma.$transaction([
    prisma.invitation.delete({
      where: {
        tokenHash,
      },
    }),
    prisma.membership.create({
      data: {
        organizationId,
        userId,
        membershipRole: "MEMBER",
        isActive: false,
      },
    }),
  ]);
};

export const markInvitationAcceptedWithoutAccount = async (tokenHash: string) => {
  return prisma.invitation.update({
    where: {
      tokenHash,
    },
    data: {
      status: "ACCEPTED_WITHOUT_ACCOUNT",
    },
  });
};

// TODO https://chatgpt.com/share/68b2fa73-1aa0-8005-bf5f-92076467566a