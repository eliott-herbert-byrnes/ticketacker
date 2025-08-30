"use server";

import { setCookieByKey } from "@/app/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/utils/crypto";
import { ResetSchema } from "../schema/files";
import { hashPassword } from "../utils/hash-and-verify";

const passwordResetSchema = ResetSchema

export const passwordReset = async (
  tokenId: string,
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const { password } = passwordResetSchema.parse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const tokenHash = hashToken(tokenId);

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (
      !passwordResetToken ||
      Date.now() > passwordResetToken.expiresAt.getTime()
    ) {
      await setCookieByKey("toast", "Password reset link has expired");
      return {
        status: "ERROR",
        fieldErrors: {},
        timestamp: Date.now(),
      } as ActionState;
    }

    const user = await prisma.user.findUnique({
      where: { id: passwordResetToken.userId },
    });

    if (!user) {
      return toActionState("ERROR", "User not found");
    }

    await prisma.passwordResetToken.delete({ where: { tokenHash } });

    await prisma.session.deleteMany({ where: { userId: user.id } });

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await setCookieByKey("toast", "Successfully reset password");

    return {
      status: "SUCCESS",
      fieldErrors: {},
      timestamp: Date.now(),
      data: {
        email: user.email,
        password,
      },
    } as ActionState;
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};
