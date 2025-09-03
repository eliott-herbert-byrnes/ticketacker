"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ticketPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import * as attachmentSubjectDTO from "@/features/attachments/dto/attachment-subject-dto";
import { fileSchema } from "@/features/attachments/schema/files";
import * as attachmentService from "@/features/attachments/service";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import * as ticketData from "@/features/ticket/data";
import { findTicketIdsFromText } from "@/utils/find-ids-from-text";
import * as commentData from "../data";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1024),
  files: fileSchema,
});

const buildMentionsMapFromText = async (text: string) => {
  const ids = findTicketIdsFromText("tickets", text);
  if (ids.length === 0) return {};

  const tickets = await ticketData.findTicketIdTitle(ids);

  return tickets.reduce<Record<string, string>>((acc, t) => {
    if (t.title) acc[t.id] = t.title;
    return acc;
  }, {});
};

export const createComment = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  if (!user) {
    return toActionState(
      "ERROR",
      "You are not authorized to make this request"
    );
  }

  try {
    const { content, files } = createCommentSchema.parse({
      content: formData.get("content"),
      files: formData.getAll("files"),
    });

    const mentions = await buildMentionsMapFromText(content);

    const comment = await commentData.createComment({
      userId: user.id,
      ticketId,
      content,
      mentions,
      include: {
        user: {
          select: {
            username: true,
          },
        },
        ticket: true,
      },
    });

    const subject = attachmentSubjectDTO.fromComment(comment);

    if (!subject) {
      return toActionState("ERROR", "Comment not created");
    }

    await attachmentService.createAttachments({
      subject,
      entity: "COMMENT",
      entityId: comment.id,
      files,
    });

    await ticketData.connectReferencedTickets(
      ticketId,
      findTicketIdsFromText("tickets", content)
    );

    revalidatePath(ticketPath(ticketId));

    return toActionState("SUCCESS", "Comment created", undefined, {
      ...comment,
      isOwner: true,
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
