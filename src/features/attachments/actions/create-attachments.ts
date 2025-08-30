"use server";
import { AttachmentEntity } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ticketPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { fileSchema } from "../schema/files";
import * as attachmentService from "../service";
import { AttachmentSubject, isComment, isTicket } from "../types";

const createAttachmentsSchema = z.object({
  files: fileSchema.refine((files) => files.length !== 0, "File is required"),
});

type CreateAttachmentsArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

export const createAttachments = async (
  { entityId, entity }: CreateAttachmentsArgs,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  const subject = (await attachmentService.getAttachmentSubject(
    entityId,
    entity
  )) as AttachmentSubject | null;

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not the owner of this subject");
  }

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    await attachmentService.createAttachments({
      subject,
      entity,
      entityId,
      files,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

switch (entity) {
  case AttachmentEntity.TICKET:
    if (isTicket(subject)) {
      revalidatePath(ticketPath(subject.id));
    }
    break;
  case AttachmentEntity.COMMENT:
    if (isComment(subject)) {
      revalidatePath(ticketPath(subject.ticket.id));
    }
    break;
}

  return toActionState("SUCCESS", "Attachment(s) uploaded");
};