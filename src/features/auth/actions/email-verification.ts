"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { setCookieByKey } from "@/app/actions/cookies";
import { ticketsPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import * as userData from "../data";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";

const emailVerificationSchema = z.object({
  code: z.string().length(8),
});

export const emailVerification = async (
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
    checkOrganization: false,
    checkActiveOrganization: false,
  });

  if (!user) {
    return toActionState("ERROR", "Invalid or expired");
  }

  try {
    const { code } = emailVerificationSchema.parse(
      Object.fromEntries(formData)
    );

    const token = await userData.findVerificationToken(user.id, code);
    if (!token) return toActionState("ERROR", "Invalid or expired");
    

    const dbUser = await userData.findUserById(user.id);
    if (!dbUser) return toActionState("ERROR", "User not found");
    

    if (dbUser.email === token.email) {
      await userData.updateUser(dbUser.id);
    } else {
      const emailTaken = await userData.findUserByEmail(token.email)
      if (emailTaken) return toActionState("ERROR", "That email is already in use");
    
      await userData.updateUser(dbUser.id, token.email);
    }

    await userData.deleteToken(token.id);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Email verified");
  redirect(ticketsPath());
};
