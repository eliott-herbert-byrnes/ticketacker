import { prisma } from "@/lib/prisma";

export const deleteToken = async (id: string) => {
  return await prisma.emailVerificationToken.delete({
    where: { id }
  });
};
