"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { setCookieByKey } from "@/app/actions/cookies";
import { ticketPath, ticketsPath } from "@/app/paths";
import { ActionState, fromErrorToActionState, ToActionState } from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";

const UpsertTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
});

const UpsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const data = UpsertTicketSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
    });

    const ticket = await prisma.ticket.findFirst({
      where: { title: data.title, content: data.content },
      orderBy: { createdAt: "desc" },
    });

    await prisma.ticket.upsert({
      where: {
        id: id || "",
      },
      update: data,
      create: data,
    });

    revalidatePath(ticketsPath());
  if (ticket?.id) {
      await setCookieByKey('toast', 'Ticket updated')
     redirect(ticketPath(ticket.id))  ;
  }

  } catch (error) {
    return fromErrorToActionState(error, formData)
  }

  return ToActionState('SUCCESS', 'Ticket Created');
};

export { UpsertTicket };
