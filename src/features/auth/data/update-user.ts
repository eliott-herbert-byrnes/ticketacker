import { prisma } from "@/lib/prisma";

export const updateUser = async (id: string, email?: string) => {
  return await prisma.user.update({
    where: { id },
    data: {
      ...(email ? {email}: {}),
      emailVerified: new Date(),
    },
  });
};
