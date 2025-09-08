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

export const markInvitationAcceptedWithoutAccount = async (
  tokenHash: string
) => {
  return prisma.invitation.update({
    where: {
      tokenHash,
    },
    data: {
      status: "ACCEPTED_WITHOUT_ACCOUNT",
    },
  });
};

export const createInvitation = async (
  tokenHash: string,
  invitedByUserId: string,
  organizationId: string,
  email: string
) => {
  return await prisma.invitation.create({
    data: {
      tokenHash,
      invitedByUserId,
      organizationId,
      email,
    },
  });
};

export const deleteInvitation = async (
  email: string,
  organizationId: string
) => {
  return await prisma.invitation.delete({
    where: {
      invitationId: {
        email,
        organizationId,
      },
    },
  });
};

export const deleteManyInvitation = async (
  email: string,
  organizationId: string
) => {
  return await prisma.invitation.deleteMany({
    where: {
      email,
      organizationId,
    },
  });
};

