"use server";

import { revalidatePath } from "next/cache";
import {  organizationPath } from "@/app/paths";
import { fromErrorToActionState } from "@/components/form/utils/to-action-state";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import * as organizationData from "../data"
import { getOrganizationsByUser } from "../queries/get-organization-by-user";

export const deleteOrganization = async (organizationId: string) => {
  await getAdminOrRedirect(organizationId);

  try {
    const organizations = await getOrganizationsByUser();

    const canDelete = organizations.some(
      (organization) => organization.id === organizationId
    );

    if (!canDelete) {
      return toActionState("ERROR", "Not a member of this organization");
    }

    await organizationData.deleteOrganization(organizationId)

  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(organizationPath());

  return toActionState("SUCCESS", "Organization deleted");
};