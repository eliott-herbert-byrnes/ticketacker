import { prisma } from "@/lib/prisma";

export const findUser = async (email: string) => {
    return await prisma.user.findUnique({
          where: { email },
        });
}

export const updateUser = async (id: string, passwordHash: string) => {
    return await prisma.user.update({
      where: { id},
      data: { passwordHash },
    });
}

export const findUnique = async (tokenHash: string) => {
    return await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

}

export const deleteToken = async (tokenHash: string) => {
    return await prisma.passwordResetToken.delete({ where: { tokenHash } });
}

export const deleteMany = async (userId: string) => {
    return await prisma.session.deleteMany({ where: { userId } });
}

export const findOrThrow = async (id: string) => {
    return await prisma.user.findUniqueOrThrow({ where: { id, } });
}