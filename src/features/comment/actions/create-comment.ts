"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ticketPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import * as attachmentSubjectDTO from "@/features/attachments/dto/attachment-subject-dto"
import { fileSchema } from "@/features/attachments/schema/files";
import * as attachmentService from "@/features/attachments/service";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import * as ticketData from "@/features/ticket/data"
import { findTicketIdsFromText } from "@/utils/find-ids-from-text";
import * as commentData from "../data"

const createCommentSchema = z.object({
  content: z.string().min(1).max(1024),
  files: fileSchema,
});

export const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  if (!user){
    return toActionState("ERROR", "You are not authorized to make this request")
  }

  let comment;

  try {
    const {content, files} = createCommentSchema.parse({
      content: formData.get("content"),
      files: formData.getAll("files")
    });

    comment = await commentData.createComment({
      userId: user.id,
      ticketId,
      content,
      include: {
        user: {
          select: {
            username: true,
          },
        },
        ticket: true,
      }
    })

    const subject = attachmentSubjectDTO.fromComment(comment)

    if(!subject){
      return toActionState("ERROR", "Comment not created")
    }

    await attachmentService.createAttachments({
      subject: subject,
      entity: "COMMENT",
      entityId: comment.id,
      files,
    })

    await ticketData.connectReferencedTickets(ticketId, findTicketIdsFromText("tickets", content))

    revalidatePath(ticketPath(ticketId));
    
  } catch (error) {
    return fromErrorToActionState(error);
  }
  
  return toActionState("SUCCESS", "Comment created", undefined, {
    ...comment,
    isOwner: true,
  });
};
