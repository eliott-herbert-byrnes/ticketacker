"use server";

import { revalidatePath } from "next/cache";
import { organizationPath } from "@/app/paths";
import { fromErrorToActionState } from "@/components/form/utils/to-action-state";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { getOrganizationsByUser } from "../queries/get-organization-by-user";

export const switchOrganization = async (organizationId: string) => {
  const { user } = await getAuthOrRedirect({
    checkActiveOrganization: false,
  });

  try {
    const organizations = await getOrganizationsByUser();

    const canSwitch = organizations.some(
      (organization) => organization.id === organizationId
    );

    if (!canSwitch) {
      return toActionState("ERROR", "Organization not found");
    }

    await prisma.$transaction([
      prisma.membership.updateMany({
        where: {
          userId: user!.id,
          organizationId: {
            not: organizationId,
          },
        },
        data: {
          isActive: false,
        },
      }),

      prisma.membership.update({
        where: {
          membershipId: {
            organizationId,
            userId: user!.id,
          },
        },
        data: {
          isActive: true,
        },
      }),
    ]);
  } catch (error) {
    return fromErrorToActionState(error);
  }
  revalidatePath(organizationPath());
  return toActionState("SUCCESS", "Active organization has been switched");
};
