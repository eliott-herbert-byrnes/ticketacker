"use server";

import { AuthError } from "next-auth";
import { demoPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { signIn } from "@/lib/auth";

export async function signInDemoAction(
): Promise<ActionState> {
  try {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    
    if (!isDemoMode) {
      return toActionState(
        "ERROR",
        "Demo mode is not enabled",
        undefined
      );
    }

    const demoEmail = process.env.DEMO_EMAIL;
    const demoPassword = process.env.DEMO_PASSWORD;

    if (!demoEmail || !demoPassword) {
      return toActionState(
        "ERROR",
        "Demo credentials not configured",
        undefined
      );
    }

    const result = await signIn("credentials", {
      email: demoEmail,
      password: demoPassword,
      redirect: false,
    });

    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error
    ) {
      return toActionState(
        "ERROR",
        "Demo sign-in failed. Please contact support.",
        undefined
      );
    }

    return toActionState("SUCCESS", "Successfully signed in as demo user", undefined, {
      redirectTo: demoPath(),
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return toActionState(
        "ERROR",
        "Demo sign-in failed. Please contact support.",
        undefined
      );
    }
    return fromErrorToActionState(err);
  }
}