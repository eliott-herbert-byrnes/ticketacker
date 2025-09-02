import { AttachmentEntity } from "@prisma/client";
import { prisma, } from "@/lib/prisma";
import * as AttachmentSubjectDTO from "../dto/attachment-subject-dto"

export const getAttachmentSubject = async (
  entityId: string,
  entity: AttachmentEntity,
): Promise<AttachmentSubjectDTO.Type | null> => {
  switch (entity) {
    case "TICKET": {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: entityId,
        },
      });

      return AttachmentSubjectDTO.fromTicket(ticket);
    }
    case "COMMENT": {
      const comment = await prisma.comment.findUnique({
        where: {
          id: entityId,
        },
        include: {
          ticket: true,
        },
      });

      return AttachmentSubjectDTO.fromComment(comment);
    }
    default:
      return null;
  }
};