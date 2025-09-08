"use server";

import { revalidatePath } from "next/cache";
import { ticketsPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { getOrgStripeFeatures } from "@/features/stripe/queries/get-org-features";
import * as ticketData from "@/features/ticket/data";
import { getTicketPermissions } from "@/features/ticket/permissions/get-ticket-permissions";

export async function updateTicketPrivacy(id: string, makePrivate: boolean) {
  const { user } = await getAuthOrRedirect();

  try {
    const ticket = await ticketData.findTicket(id);
    if (!ticket) return toActionState("ERROR", "Ticket not found");

    const perms = await getTicketPermissions({
      organizationId: ticket.organizationId,
      userId: user!.id,
    });
    if (!perms?.canUpdateTicket) {
      return toActionState("ERROR", "Not authorized");
    }

    if (makePrivate) {
      const { canMakePrivateTickets } = await getOrgStripeFeatures(ticket.organizationId);
      if (!canMakePrivateTickets) {
        return toActionState("ERROR", "You need to subscribe to activate this feature");
      }
    }

    await ticketData.updateTicket(ticket.id, {
      userId: ticket.userId,
      bounty: ticket.bounty,
      title: ticket.title,
      content: ticket.content,
      deadline: ticket.deadline,
      private: makePrivate,
    });

    revalidatePath(ticketsPath());
    return toActionState(
      "SUCCESS",
      makePrivate ? "Ticket made private" : "Ticket made public"
    );
  } catch (err) {
    return fromErrorToActionState(err);
  }
}
