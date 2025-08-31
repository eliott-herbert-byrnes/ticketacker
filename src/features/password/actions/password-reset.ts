"use server";

import { setCookieByKey } from "@/app/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { hashToken } from "@/utils/crypto";
import * as passwordData from "../data";
import { ResetSchema } from "../schema/files";
import { hashPassword } from "../utils/hash-and-verify";

const passwordResetSchema = ResetSchema;

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

    const passwordResetToken = await passwordData.findUnique(tokenHash);

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

    const user = await passwordData.findUser(passwordResetToken.userId);

    if (!user) {
      return toActionState("ERROR", "User not found");
    }

    await passwordData.deleteToken(tokenHash);

    await passwordData.deleteMany(user.id);

    const passwordHash = await hashPassword(password);

    await passwordData.updateUser(user.id, passwordHash);

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
