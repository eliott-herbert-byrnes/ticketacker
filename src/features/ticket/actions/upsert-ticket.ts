"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { setCookieByKey } from "@/app/actions/cookies";
import { homePath, ticketsPath } from "@/app/paths";
import { ActionState, fromErrorToActionState, toActionState } from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { toCent } from "@/utils/currency";
import { getAuthOrRedirect } from "../../auth/queries/get-auth-or-redirect";
import { isOwner } from "../../auth/utils/is-owner";

const UpsertTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Is required"),
  bounty: z.coerce.number().positive(),
});

const UpsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
) => {

  const {user, activeOrganization} = await getAuthOrRedirect()
try {
    const data = UpsertTicketSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      deadline: formData.get("deadline"),
      bounty: formData.get("bounty"),
    });

    const dbData = {
      ...data,
      userId: user!.id,
      bounty: toCent(data.bounty),
    };

    if (id) {
      const existing = await prisma.ticket.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existing || !isOwner(user, existing)) {
        return toActionState("ERROR", "Not authorized");
      }

      await prisma.ticket.update({
        where: { id },
        data: dbData,
      });

      revalidatePath(ticketsPath());
      await setCookieByKey("toast", "Ticket updated");
      redirect(homePath()); 
    } else {
      if (!activeOrganization) {
        return toActionState(
          "ERROR",
          "You need an active organization to create a ticket."
        );
      }

      await prisma.ticket.create({
        data: {
          ...dbData,
          organizationId: activeOrganization.id,
        },
      });

      revalidatePath(ticketsPath());
      // await setCookieByKey("toast", "Ticket created");
      return toActionState("SUCCESS", "Ticket Created");
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};

export { UpsertTicket };