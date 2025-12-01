"use server";
import { revalidatePath } from "next/cache";
import { ticketPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import * as ticketService from "@/features/ticket/service/disconnect-referenced-tickets-via-comment";
import * as commentData from "../data";

const deleteComment = async (id: string) => {
  try {
    const { user } = await getAuthOrRedirect();

    const comment = await commentData.findComment(id);

    if (!comment || !isOwner(user, comment)) {
      return toActionState("ERROR", "Not authorized");
    }
    await commentData.deleteComment(id);
    await ticketService.disconnectReferencedTicketsViaComment(comment);

    revalidatePath(ticketPath(comment.ticketId));

    return toActionState("SUCCESS", "Comment deleted");
  } catch (error) {
    return fromErrorToActionState(error);
  }
};

export { deleteComment };
