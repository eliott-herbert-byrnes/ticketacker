// src/features/organization/actions/create-organization.ts
'use server'

import { z } from "zod";
import { organizationPath } from "@/app/paths";
import { ActionState, fromErrorToActionState, toActionState } from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";

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

    await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          ...data,
          memberships: {
            create: {
              userId: user.id,
              isActive: true,
              membershipRole: "ADMIN",
            },
          },
        },
      });

      await tx.membership.updateMany({
        where: {
          userId: user.id,
          organizationId: { not: organization.id },
        },
        data: { isActive: false },
      });
    });

    return {
      ...toActionState("SUCCESS", "Organization created"),
      data: { redirectTo: organizationPath() },
    };
  } catch (error) {
    return fromErrorToActionState(error);
  }
}
