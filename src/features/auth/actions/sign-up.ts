"use server";
import { Prisma } from "@prisma/client";
import { ticketsPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { SignUpfilesSchema } from "../schema/files";
import * as InvitationService from "../service/index"

const signUpSchema = SignUpfilesSchema

export async function signUpAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = signUpSchema.parse(Object.fromEntries(formData));
    const username = parsed.username.trim();
    const email = parsed.email.toLowerCase().trim();
    const password = parsed.password;


    const result = await InvitationService.signUp({
      username, email, password,
    })

    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error
    ) {
      return toActionState(
        "ERROR",
        "Sign in failed after registration",
        formData
      );
    }
    
    return {
      ...toActionState("SUCCESS", "Account created — signed in"),
      data: { redirectTo: ticketsPath() },
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState(
        "ERROR",
        "Username or email already in use",
        formData
      );
    }
    return fromErrorToActionState(error, formData);
  }

}
