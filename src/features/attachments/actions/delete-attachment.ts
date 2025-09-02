"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import * as attachmentData from "../data";
import * as attachmentSubjectDTO from "../dto/attachment-subject-dto";

export const deleteAttachment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  const attachment = await attachmentData.getAttachmentUnique(id, {
    ticket: true,
    comment: { include: { ticket: true } },
  });

  if (!attachment) {
    return toActionState("ERROR", "Attachment not found");
  }

  let subject = null as
    | ReturnType<typeof attachmentSubjectDTO.fromTicket>
    | ReturnType<typeof attachmentSubjectDTO.fromComment>;
  switch (attachment.entity) {
    case "TICKET":
      subject = attachmentSubjectDTO.fromTicket(attachment.ticket);
      break;
    case "COMMENT":
      subject = attachmentSubjectDTO.fromComment(attachment.comment);
      break;
  }

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not authorised");
  }

  try {
    await attachmentData.deleteAttachment(id);

    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        organizationId: subject.organizationId,
        entityId: subject.entityId,
        entity: attachment.entity,
        fileName: attachment.name,
        attachmentId: attachment.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Attachment deleted");
};
