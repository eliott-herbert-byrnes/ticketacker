import { prisma } from "@/lib/prisma";

export const findComment = async (id: string) => {
    return await prisma.comment.findUnique({
        where: { id },
      });
}