// src/features/auth/components/sign-up-form.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Input } from "@/components/ui/input";
import { signUpAction } from "../actions/sign-up";

export function SignUpForm() {
  const router = useRouter();

  const [actionState, action] = useActionState<ActionState>(
    signUpAction,
    EMPTY_ACTION_STATE
  );

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
      />
      <FieldError actionState={actionState} name="password" />

      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      {actionState.status === "ERROR" && (
        <p className="text-red-500 text-sm mt-2">{actionState.message}</p>
      )}

      <div className="mt-2">
        <SubmitButton label="Sign Up" />
      </div>
    </Form>
  );
}
