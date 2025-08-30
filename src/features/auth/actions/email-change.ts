"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { emailVerificationPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { inngest } from "@/lib/inngest";
import * as userData from "../data"
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import { generateEmailVerificationCode } from "../utils/generate-email-verification-code";

const emailChangeSchema = z.object({
  email: z.string().min(1, { message: "Is Required" }).max(191).email(),
});

export async function emailChange(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const auth = await getAuthOrRedirect({ checkEmailVerified: false });
    if(!auth.user){
      return toActionState("ERROR", "Not authorized", formData)
    }

    const { email } = emailChangeSchema.parse(Object.fromEntries(formData));
    const newEmail = email.trim().toLowerCase();

    const user = await userData.findUserById(auth.user.id)

    if (!user) {
      return toActionState("ERROR", "User not found", formData);
    }

    if (newEmail === user.email) {
      return toActionState(
        "ERROR",
        "New email matches your current email",
        formData
      );
    }

    const existingUser = await userData.findUserByEmail(newEmail)

    if (existingUser) {
      return toActionState("ERROR", "That email is already in use", formData);
    }

    const code = await generateEmailVerificationCode(user.id, newEmail);

    await inngest.send({
      name: "app/auth.email-change-request",
      data: {
        userId: user.id,
        username: user.username ?? "",
        email: newEmail,
        code,
      },
    });

    return {
      ...toActionState("SUCCESS", "Verification email sent"),
      data: { redirectTo: `${emailVerificationPath()}?mode=change` },
    };
  } catch (err) {
    if (err instanceof AuthError) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }
    return fromErrorToActionState(err, formData);
  }
}
