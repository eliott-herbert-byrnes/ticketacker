"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { sendEmailVerification } from "@/features/emails/send-email-verification";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import { canResendVerificationEmail } from "../utils/can-resend-verification-email";
import { generateEmailVerificationCode } from "../utils/generate-email-verification-code";

export const emailVerificationResend = async () => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
    checkOrganization: false,
    checkActiveOrganization: false,
  });

  if (!user) {
    return toActionState("ERROR", "Invalid or expired");
  }

  try {
    const canResend = await canResendVerificationEmail(user.id);
    if (!canResend) {
      return toActionState(
        "ERROR",
        "You can only resend the verification email once every minute."
      );
    }

    const code = await generateEmailVerificationCode(
      user.id,
      user.email as string
    );

    const result = await sendEmailVerification(
      user.username as string,
      user.email as string,
      code
    );

    if (result.error) {
      return toActionState("ERROR", "Failed to send email verification");
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }
  return toActionState("SUCCESS", "Verification email has been sent");
};
