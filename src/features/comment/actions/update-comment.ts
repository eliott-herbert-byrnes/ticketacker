"use server";

import { revalidatePath } from "next/cache";
import { ticketPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";

const updateComment = async (id: string, content: string) => {
  const { user } = await getAuthOrRedirect();

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment || !isOwner(user, comment)) {
    return toActionState("ERROR", "Not authorized");
  }

  try {
    await prisma.comment.update({
      where: { id },
      data: {content}
    });
  } catch (error) {
    fromErrorToActionState(error);
  }

  revalidatePath(ticketPath(comment.ticketId));

  return toActionState("SUCCESS", "Comment updated");
};

export { updateComment };
