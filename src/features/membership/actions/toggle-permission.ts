"use server";
import { revalidatePath } from "next/cache";
import {z} from "zod";
import { membershipsPath } from "@/app/paths";
import { toActionState } from "@/components/form/utils/to-action-state";
import { PERMISSION_KEYS, PermissionKey } from "@/features/ticket/permissions/keys/permission-keys"; 
import { prisma } from "@/lib/prisma";
import { getAdminOrRedirect } from "../queries/get-admin-or-redirect";

// toggle of membership permissions
// const PERMISSION_KEYS = ["canDeleteTicket", "canUpdateTicket"] as const;
// type PermissionKey = (typeof PERMISSION_KEYS)[number];
const PermissionKeySchema = z.enum(PERMISSION_KEYS);

export const togglePermission = async ({
  userId,
  organizationId,
  permissionKey,
}: {
  userId: string;
  organizationId: string;
  permissionKey: PermissionKey;
}) => {
  await getAdminOrRedirect(organizationId);

  const parsed = PermissionKeySchema.safeParse(permissionKey);
  if (!parsed.success) {
    return toActionState("ERROR", "Invalid permission key");
  }

  const where = {
    membershipId: {
      userId,
      organizationId,
    },
  };

  const membership = await prisma.membership.findUnique({
    where,
    select: {
      canDeleteTicket: true,
      canUpdateTicket: true,
    },
  });

  if (!membership) {
    return toActionState("ERROR", "Membership not found");
  }

  const data =
    permissionKey === "canDeleteTicket"
      ? { canDeleteTicket: !membership.canDeleteTicket }
      : { canUpdateTicket: !membership.canUpdateTicket };

  await prisma.membership.update({
    where,
    data,
  });

  revalidatePath(membershipsPath(organizationId));

  return toActionState("SUCCESS", "Permission updated");
};
