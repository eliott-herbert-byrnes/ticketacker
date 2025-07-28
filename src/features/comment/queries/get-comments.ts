import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";

export const getComments = async (ticketId: string) => {

    const {user} = await getAuth();

    const comments =  prisma.comment.findMany({
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

  return (await comments).map((comment) => ({
    ...comment,
    isOwner: isOwner(user, comment)
  }))
}