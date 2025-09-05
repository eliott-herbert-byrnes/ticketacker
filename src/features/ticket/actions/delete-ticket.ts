"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setCookieByKey } from "@/app/actions/cookies";
import { homePath, ticketsPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import * as credentialData from "@/features/credentials/data"
import { getAuthOrRedirect } from "../../auth/queries/get-auth-or-redirect";
import * as ticketData from "../data";
import { getTicketPermissions } from "../permissions/get-ticket-permissions";

export const deleteTicket = async (id: string, credentialId?: string) => {
  const { user } = await getAuthOrRedirect();

  try {
    const ticket = await ticketData.findTicket(id);
    if (!ticket) return toActionState("ERROR", "Ticket not found");

    if (credentialId) {
      const cred = await credentialData.findCredential(credentialId, ticket.organizationId)

      const isRevoked = !!cred?.revokedAt && cred.revokedAt > cred.createdAt;

      if (!cred || isRevoked) {
        return toActionState("ERROR", "Credential invalid or revoked");
      }
    }

    const perms = await getTicketPermissions({
      organizationId: ticket.organizationId,
      userId: user!.id,
    });

    const canDelete = !!perms.canDeleteTicket;
    if (!canDelete) {
      return toActionState("ERROR", "Not authorized");
    }

    await ticketData.deleteTicket(id);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());
  await setCookieByKey("toast", "Ticket deleted");
  redirect(homePath());
};
