"use server";

import { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ticketsPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "../../auth/queries/get-auth-or-redirect";
import * as ticketData from "../data";
import { getTicketPermissions } from "../permissions/get-ticket-permissions";

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const { user } = await getAuthOrRedirect();

  try {
    const ticket = await ticketData.findTicket(id);

    if (!ticket) {
      return toActionState("ERROR", "Unable to locate ticket");
    }

    const perms = await getTicketPermissions({
      organizationId: ticket.organizationId,
      userId: user!.id,
    });
    const canUpdate = !!perms.canUpdateTicket;
    if (!canUpdate) return toActionState("ERROR", "Not authorized");

    await ticketData.updateTicketStatusById(id, status);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());
  return toActionState("SUCCESS", "Status Updated");
};
