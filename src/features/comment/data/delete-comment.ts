import { prisma } from "@/lib/prisma";

export const deleteComment = async (id: string) => {
  return await prisma.comment.delete({
    where: { id },
  });
};
