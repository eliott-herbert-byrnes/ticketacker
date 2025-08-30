import { AttachmentEntity } from "@prisma/client";
import { prisma, } from "@/lib/prisma";

export async function getAttachmentSubject(
  entityId: string,
  entity: AttachmentEntity
) {
  if (entity === AttachmentEntity.TICKET) {
    return prisma.ticket.findUnique({
      where: { id: entityId },
      select: { id: true, organizationId: true, userId: true }, 
    });
  }

  if (entity === AttachmentEntity.COMMENT) {
    return prisma.comment.findUnique({
      where: { id: entityId },
      include: {
        ticket: { select: { id: true, organizationId: true } },
      },
    });
  }

  return null;
}
