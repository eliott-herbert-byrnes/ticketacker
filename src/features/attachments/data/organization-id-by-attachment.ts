import { prisma } from "@/lib/prisma";

export const OrganizationIdByAttachment = async (id: string) => {
  return await prisma.attachment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      ticket: true,
      comment: {
        include: {
          ticket: true,
        },
      },
    },
  });
};
