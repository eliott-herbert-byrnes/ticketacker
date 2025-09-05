"use server";
import { revalidatePath } from "next/cache";
import { credentialsPath } from "@/app/paths";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";

export const revokeCredential = async ({
  id,
  organizationId,
}: {
  id: string;
  organizationId: string;
}) => {
  await getAdminOrRedirect(organizationId);

  const existing = await prisma.credential.findFirst({
    where: { id, organizationId },
    select: { id: true, revokedAt: true },
  });

  if (!existing) {
    return toActionState("ERROR", "Credential not found");
  }

  if (existing.revokedAt) {
    return toActionState("ERROR", "Credential already revoked");
  }

  await prisma.credential.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  });

  revalidatePath(credentialsPath(organizationId));

  return toActionState("SUCCESS", "Credential revoked");
};
