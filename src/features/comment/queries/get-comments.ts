import { prisma } from "@/lib/prisma";

export const getComments = async (ticketId: string) => {
    return prisma.comment.findMany({
    where: {
      ticketId,
    },
    include: {
        user: {
            select: {
                username: true,
            },
        },
    },
    orderBy: {
        createdAt: "asc"
    }
  });
}