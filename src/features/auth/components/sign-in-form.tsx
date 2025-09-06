"use client";

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
import { signInAction } from "../actions/sign-in";

type SignInData = {
  redirectTo: string;
  rateLimit?: { retryAfter?: number; remaining: number };
};

export function SignInForm() {
  const router = useRouter();
  const [actionState, action] = useActionState(
    signInAction,
    EMPTY_ACTION_STATE as ActionState<SignInData>
  );

  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    if (actionState.status === "ERROR") {
      const retryAfter = actionState.data?.rateLimit?.retryAfter ?? 0;
      if (retryAfter > 0) setCooldown(retryAfter);
    }
  }, [actionState]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      router.refresh();

      if (actionState.data?.redirectTo) {
        router.push(actionState.data.redirectTo);
      }
    }
  }, [actionState, router]);

  const attemptsRemaining = actionState.data?.rateLimit?.remaining;

  return (
    <Form action={action} actionState={actionState}>
      <Input name="email" placeholder="john@example.com" />
      <FieldError actionState={actionState} name="email" />

      <Input name="password" type="password" placeholder="••••••••" />
      <FieldError actionState={actionState} name="password" />

      {actionState?.status === "ERROR" && (
        <p
          className="text-red-500 text-sm mt-2"
          role="alert"
          aria-live="polite"
        >
          {actionState.message}
          {cooldown > 0 && (
            <>
              Try again in <strong>{cooldown}s</strong>.
            </>
          )}
        </p>
      )}

      {typeof attemptsRemaining === "number" &&
        attemptsRemaining >= 0 &&
        cooldown === 0 && (
          <p className="text-xs mt-2 text-muted-foreground" aria-live="polite">
            Attempts Remaining: {attemptsRemaining}
          </p>
        )}

      <div className="mt-2">
        <SubmitButton
          label={cooldown > 0 ? `Try again in ${cooldown}s` : "Sign In"}
          disabled={cooldown > 0}
        />
      </div>
    </Form>
  );
}
