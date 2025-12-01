"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { ticketPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { s3 } from "@/lib/aws";
import * as attachmentData from "../data";
import * as attachmentSubjectDTO from "../dto/attachment-subject-dto";
import { generateS3Key } from "../utils/generate-s3-key";

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

    // Delete from S3 directly instead of using Inngest event
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: generateS3Key({
          organizationId: subject.organizationId,
          entityId: subject.entityId,
          entity: attachment.entity,
          fileName: attachment.name,
          attachmentId: attachment.id,
        }),
      })
    );

    switch (attachment.entity) {
      case "TICKET":
        revalidatePath(ticketPath(subject.ticketId));
        break;
      case "COMMENT":
        revalidatePath(ticketPath(subject.ticketId));
        break;
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Attachment deleted");
};
