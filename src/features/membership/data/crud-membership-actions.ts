import { MembershipRole, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const deleteMembership = async (
  userId: string,
  organizationId: string
) => {
  return await prisma.membership.delete({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
  });
};

export const findMembership = async (
  where: Prisma.MembershipWhereUniqueInput
) => {
  return await prisma.membership.findUnique({
    where,
    select: {
      canDeleteTicket: true,
      canUpdateTicket: true,
    },
  });
};

export const updateMembership = async (
  userId: string,
  organizationId: string,
  membershipRole: MembershipRole
) => {
  return await prisma.membership.update({
    where: {
      membershipId: {
        userId,
        organizationId,
      },
    },
    data: {
      membershipRole,
    },
  });
};
