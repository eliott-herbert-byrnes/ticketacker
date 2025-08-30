import { prisma } from "@/lib/prisma";

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, username: true },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
};

export const findVerificationToken = async (userId: string, code: string) => {
    return await prisma.emailVerificationToken.findFirst({
      where: {
        userId,
        code,
        expiresAt: { gt: new Date() },
      },
    });
}