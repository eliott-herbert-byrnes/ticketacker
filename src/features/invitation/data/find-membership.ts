import { prisma } from "@/lib/prisma";

export const findMembership = async (organizationId: string, email: string) => {
  return await prisma.membership.findFirst({
    where: {
      organizationId,
      user: {
        email,
      },
    },
  });
};
