"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ticketPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { CommentWithMetadata } from "../types";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1024),
});

export const createComment = async (
  ticketId: string,
  _actionState: ActionState<CommentWithMetadata | undefined>,
  formData: FormData
): Promise<ActionState<CommentWithMetadata | undefined>> => {
  const { user } = await getAuthOrRedirect();

  let comment;

  try {
    const data = createCommentSchema.parse(Object.fromEntries(formData));

    comment = await prisma.comment.create({
      data: {
        userId: user?.id,
        ticketId: ticketId,
        ...data,
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState<CommentWithMetadata | undefined>(
    "SUCCESS",
    "Comment created",
    undefined,
    comment ? { ...comment, isOwner: true } : undefined
  );
};
