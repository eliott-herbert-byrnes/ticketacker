"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Input } from "@/components/ui/input";
import { checkPasswordStrength } from "@/features/password/utils/password-strength";
import { signUpAction } from "../actions/sign-up";

export function SignUpForm() {
  const router = useRouter();

  const [actionState, action] = useActionState<ActionState>(
    signUpAction,
    EMPTY_ACTION_STATE
  );

  const [strength, setStrength] = useState<number | null>(null);

  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      router.refresh();
      const to = actionState.data?.redirectTo as string | undefined;
      if (to) router.push(to);
    }
  }, [actionState, router]);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="username"
        placeholder="Username"
        defaultValue={actionState.payload?.get("username") as string}
      />
      <FieldError actionState={actionState} name="username" />

      <Input
        name="email"
        placeholder="Email"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError actionState={actionState} name="email" />

      <Input
        name="password"
        type="password"
        placeholder="Password"
        defaultValue={actionState.payload?.get("password") as string}
        onChange={(e) => {
          const val = e.target.value;
          const result = checkPasswordStrength(val);
          setStrength(result.score);
        }}
      />
      <FieldError actionState={actionState} name="password" />

      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      {strength !== null && (
        <div
          className={clsx("text-sm mt-1", {
            "text-red-600": strength < 2,
            "text-amber-600": strength === 2,
            "text-green-600": strength > 2,
          })}
        >
          Password Strength: {[
            "Very Weak",
            "Weak",
            "Fair",
            "Good",
            "Strong",
          ][strength]}
        </div>
      )}

      <div className="mt-2">
        {strength !== null && strength > 2 ? (
          <SubmitButton label="Sign Up" />
        ) : (
          <button disabled className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-muted-foreground opacity-60 cursor-not-allowed">
            Sign Up
          </button>
        )}
      </div>
    </Form>
  );
}
