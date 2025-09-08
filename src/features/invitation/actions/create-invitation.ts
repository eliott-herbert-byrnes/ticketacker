"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { invitationsPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { getStripeProvisioningByOrganization } from "@/features/stripe/queries/get-stripe-provisioning";
import { inngest } from "@/lib/inngest";
import * as invitationData from "../data";
import { generateInvitationLink } from "../utils/generate-invitiation-link";

const createInvitiationSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export const createInvitiation = async (
  organizationId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAdminOrRedirect(organizationId);

  if (!user) {
    return toActionState("ERROR", "User not verified");
  }

  const {allowedMembers, currentMembers} = await getStripeProvisioningByOrganization(organizationId)

  if(allowedMembers <= currentMembers){
    return toActionState("ERROR", "Upgrade your subscription to invite more members.")
  }

  try {
    const { email } = createInvitiationSchema.parse({
      email: formData.get("email"),
    });

    const emailInvitationLink = await generateInvitationLink(
      user.id,
      organizationId,
      email
    );

    await inngest.send({
      name: "app/invitation.created",
      data: {
        userId: user.id,
        organizationId,
        email,
        emailInvitationLink,
      },
    });

    const targetMembership = await invitationData.findMembership(
      organizationId,
      email
    );

    if (targetMembership) {
      return toActionState(
        "ERROR",
        "User is already a member of this organization"
      );
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(invitationsPath(organizationId));
  return toActionState("SUCCESS", "User invited to organization");
};
