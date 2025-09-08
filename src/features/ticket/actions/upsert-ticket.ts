"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { setCookieByKey } from "@/app/actions/cookies";
import { homePath, ticketsPath } from "@/app/paths";
import { ActionState, fromErrorToActionState, toActionState } from "@/components/form/utils/to-action-state";
import { getOrgStripeFeatures } from "@/features/stripe/queries/get-org-features";
import { toCent } from "@/utils/currency";
import { getAuthOrRedirect } from "../../auth/queries/get-auth-or-redirect";
import { isOwner } from "../../auth/utils/is-owner";
import * as ticketData from "../data"

const UpsertTicketSchema = z.object({
  title: z.string().min(1).max(191),
  content: z.string().min(1).max(1024),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Is required"),
  bounty: z.coerce.number().positive(),
   private: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default("false"),
});

const UpsertTicket = async (
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
) => {

  const {user, activeOrganization} = await getAuthOrRedirect()
try {
    const parsed = UpsertTicketSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      deadline: formData.get("deadline"),
      bounty: formData.get("bounty"),
      private: formData.get("private") ?? "false",
    });

    let canMakePrivate = false;
    if (activeOrganization){
      const features = await getOrgStripeFeatures(activeOrganization.id);
      canMakePrivate = features.canMakePrivateTickets;
    }

    if(parsed.private && !canMakePrivate){
      return toActionState("ERROR", "Private tickets require an active subscription.")
    }

    const dbData = {
      title: parsed.title,
      content: parsed.content,
      deadline: parsed.deadline,
      bounty: toCent(parsed.bounty),
      userId: user!.id,
      private: parsed.private && canMakePrivate,
    };

    if (id) {
      const existing = await ticketData.findUniqueTicket(id);
      if (!existing || !isOwner(user, existing)) {
        return toActionState("ERROR", "Not authorized");
      }
      await ticketData.updateTicket(id, dbData);
      revalidatePath(ticketsPath());
      await setCookieByKey("toast", "Ticket updated");
      redirect(homePath());
    } else {
      if (!activeOrganization) {
        return toActionState("ERROR", "You need an active organization to create a ticket.");
      }
      await ticketData.createTicket(dbData, activeOrganization.id);
      revalidatePath(ticketsPath());
      return toActionState("SUCCESS", "Ticket Created");
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};

export { UpsertTicket };