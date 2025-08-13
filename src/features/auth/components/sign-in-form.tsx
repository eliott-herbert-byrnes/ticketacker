// src/features/auth/components/sign-in-form.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Input } from "@/components/ui/input";
import { signInAction } from "../actions/sign-in";

export function SignInForm() {
  const router = useRouter();
  const [actionState, action] = useActionState(
    signInAction,
    EMPTY_ACTION_STATE
  );

  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      router.refresh();

      if (actionState.data?.redirectTo) {
        router.push(actionState.data.redirectTo);
      }
    }
  }, [actionState, router]);

  return (
    <Form action={action} actionState={actionState}>
      <Input name="email" placeholder="john@example.com" />
      <FieldError actionState={actionState} name="email" />

      <Input name="password" type="password" placeholder="••••••••" />
      <FieldError actionState={actionState} name="password" />

      {actionState?.status === "ERROR" && (
        <p className="text-red-500 text-sm mt-2">{actionState.message}</p>
      )}

      <div className="mt-2">
        <SubmitButton label="Sign In" />
      </div>
    </Form>
  );
}
