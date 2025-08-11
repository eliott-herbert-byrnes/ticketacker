"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { ticketsPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { signIn } from "@/lib/auth";

const signInSchema = z.object({
  email: z.string().min(1, { message: "Is Required" }).max(191).email(),
  password: z.string().min(6).max(191),
});

export async function signInAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error
    ) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    return {
      ...toActionState("SUCCESS", "Successfully signed in"),
      data: { redirectTo: ticketsPath() },
    };

  } catch (err) {
    if (err instanceof AuthError) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }
    return fromErrorToActionState(err, formData);
  }
}
