"use server";

import { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ticketsPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { getAuthOrRedirect } from "../../auth/queries/get-auth-or-redirect";
import { isOwner } from "../../auth/utils/is-owner";

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const { user } = await getAuthOrRedirect();

  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
    });

    if (!ticket || !isOwner(user, ticket)) {
      return toActionState("ERROR", "Not authorized");
    }

    await prisma.ticket.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketsPath());

  return toActionState("SUCCESS", "Status Updated");
};
