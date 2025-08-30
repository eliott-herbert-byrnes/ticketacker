import { Prisma } from "@prisma/client";

type AttachmentSubjectTicket = Prisma.TicketGetPayload<{
  select: {
    id: true;
    organizationId: true;
    userId: true;
  };
}>;

type AttachmentSubjectComment = Prisma.CommentGetPayload<{
  include: {
    ticket: {
      select: {
        id: true;
        organizationId: true;
      };
    };
  };
}>;

export type AttachmentSubject =
  | AttachmentSubjectTicket
  | AttachmentSubjectComment;

export const isComment = (
  subject: AttachmentSubject
): subject is AttachmentSubjectComment => "ticket" in subject;

export const isTicket = (
  subject: AttachmentSubject
): subject is AttachmentSubjectTicket => !("ticket" in subject);
