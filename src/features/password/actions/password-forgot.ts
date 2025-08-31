"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { inngest } from "@/lib/inngest";
import * as passwordData from "../data"

const passwordForgotSchema = z.object({
  email: z.string().min(1, { message: "Is Required" }).max(191).email(),
});

export const passwordForgot = async (
  _actionState: ActionState,
  formData: FormData
) => {
  try {
    const { email } = passwordForgotSchema.parse(Object.fromEntries(formData));

  
    const user = await passwordData.findUser(email)

    if (!user) {
      return toActionState("ERROR", "Password reset link sent", formData);
    }

    await inngest.send({
      name: "app/password.password-reset",
      data: {userId: user.id},
    })

  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Password reset link sent");
};
