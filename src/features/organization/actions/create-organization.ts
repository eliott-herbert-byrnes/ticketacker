// src/features/organization/actions/create-organization.ts
'use server'

import { z } from "zod";
import { organizationPath } from "@/app/paths";
import { ActionState, fromErrorToActionState, toActionState } from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import * as organizationData from "../data"

const createOrganizationSchema = z.object({
  name: z.string().min(6).max(191)
})

export async function createOrganization(
  _actionState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user } = await getAuthOrRedirect({
    checkOrganization: false,
    checkActiveOrganization: false,
  });

  if (!user) {
    return toActionState("ERROR", "Please sign in to view this page.");
  }

  try {
    const data = createOrganizationSchema.parse({
      name: formData.get("name"),
    });

    await organizationData.createOrganizationUpdateMembership(data, user.id)

    return {
      ...toActionState("SUCCESS", "Organization created"),
      data: { redirectTo: organizationPath() },
    };
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
