"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPasswordHash } from "../utils/hash-and-verify";

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(6).max(191),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const passwordChange = async (
  _actionState: ActionState,
  formData: FormData
) => {
  const auth = await getAuthOrRedirect();

  if (!auth.user || !auth.user.email) {
    return toActionState("ERROR", "Missing user info", formData);
  }

  try {
    const { currentPassword, password } = passwordChangeSchema.parse({
      currentPassword: formData.get("currentPassword"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      return toActionState("ERROR", "User not found", formData);
    }

    const validPassword = await verifyPasswordHash(user.passwordHash, currentPassword);
    if (!validPassword) {
      return toActionState("ERROR", "Incorrect current password", formData);
    }

    const newHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return toActionState("SUCCESS", "Password changed successfully");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};