"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setCookieByKey } from "@/app/actions/cookies";
import { homePath, ticketsPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { getAuthOrRedirect } from "../../auth/queries/get-auth-or-redirect";
import { isOwner } from "../../auth/utils/is-owner";
import { getTicketPermissions } from "../permissions/get-ticket-permissions";

export const deleteTicket = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return toActionState("ERROR", "Ticket not found");
    }

    const perms = await getTicketPermissions({
      organizationId: ticket.organizationId,
      userId: user!.id,
    });

    const owner = isOwner(user, ticket);
    const adminCan = !!perms.canDeleteTicket;

    if (!owner && !adminCan) {
      return toActionState("ERROR", "Not authorized");
    }

    await prisma.ticket.delete({ where: { id } });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());
  await setCookieByKey("toast", "Ticket deleted");
  redirect(homePath());
};