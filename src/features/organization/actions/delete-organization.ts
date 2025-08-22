"use server";

import { organizationCreatePath } from "@/app/paths";
import { fromErrorToActionState } from "@/components/form/utils/to-action-state";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
// import { getOrganizationsByUser } from "../queries/get-organization-by-user";
// import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import { inngest } from "@/lib/inngest";

export const deleteOrganization = async (organizationId: string) => {
  const { user } = await getAdminOrRedirect(organizationId);

  try {
    const attachments = await prisma.attachment.findMany({
      where: { ticket: { organizationId } },
      select: { id: true, name: true, ticketId: true },
    });

    const remainingMemberships = await prisma.membership.findMany({
      where: { userId: user!.id, organizationId: { not: organizationId } },
      select: { organizationId: true, joinedAt: true },
      orderBy: { joinedAt: "asc" },
    });

    await prisma.$transaction(async (tx) => {
      await tx.organization.delete({ where: { id: organizationId } });

      if (remainingMemberships.length > 0) {
        const nextOrgId = remainingMemberships[0].organizationId;

        await tx.membership.updateMany({
          where: { userId: user!.id },
          data: { isActive: false },
        });

        await tx.membership.update({
          where: {
            membershipId: { organizationId: nextOrgId, userId: user!.id },
          },
          data: { isActive: true },
        });
      }
    });

    await Promise.all(
      attachments.map((a) =>
        inngest.send({
          name: "app/attachment.deleted",
          data: {
            organizationId,
            ticketId: a.ticketId,
            fileName: a.name,
            attachmentId: a.id,
          },
        })
      )
    );

    const remaining = await prisma.membership.count({
      where: { userId: user!.id },
    });

    if (remaining === 0) {
      return {
        ...toActionState("SUCCESS", "Organization deleted"),
        data: { redirectTo: organizationCreatePath() },
      };
    }

    return toActionState("SUCCESS", "Active organization has been switched");
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
