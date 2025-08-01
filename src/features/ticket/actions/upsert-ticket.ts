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

  const {user} = await getAuthOrRedirect()

  try {
    if(id){
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        }
      })

      if(!ticket || !isOwner(user, ticket)){
        return toActionState("ERROR", "Not authorized")
      }
    }

    const data = UpsertTicketSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      deadline: formData.get("deadline"),
      bounty: formData.get("bounty"),
    });

    const dbData = {
      ...data,
      userId: user!.id,
      bounty: toCent(data.bounty)
    }

    if (id) {
      await prisma.ticket.upsert({
        where: { id },
        update: dbData,
        create: dbData, 
      });
    } else {
      await prisma.ticket.create({
        data: dbData,
      });
    }
  } catch (error) {
    return fromErrorToActionState(error, formData)
  }

  revalidatePath(ticketsPath());

  if (id) {
    await setCookieByKey('toast', 'Ticket updated')
    redirect(homePath());
  }

  return toActionState('SUCCESS', 'Ticket Created');
};

export { UpsertTicket };