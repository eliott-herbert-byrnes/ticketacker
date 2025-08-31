"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { organizationPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
} from "@/components/form/utils/to-action-state";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import * as organizationData from "../data"

const schema = z.object({ name: z.string().min(6).max(191) });

export const renameOrganization = async (
  organizationId: string,
  _prev: ActionState,
  formData: FormData
) => {
  await getAdminOrRedirect(organizationId);

  try {
    const { name } = schema.parse({ name: formData.get("name") });

    await organizationData.updateOrganization(organizationId, name)

    revalidatePath(organizationPath());
    return toActionState("SUCCESS", "Organization renamed");

  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState("ERROR", "That name is already taken");
    }
    return fromErrorToActionState(error);
  }
};
