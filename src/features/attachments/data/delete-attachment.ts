import { prisma } from "@/lib/prisma";

export const deleteAttachment = async (id: string) => {
  return await prisma.attachment.delete({
    where: {
      id,
    },
  });
};
