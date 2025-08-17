"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { passwordForgotPath, signInPath, ticketsPath } from "@/app/paths";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { passwordReset } from "../actions/password-reset";
import { checkPasswordStrength } from "../utils/password-strength";

type PasswordResetFormProps = {
  tokenId: string;
};

export const PasswordResetForm = ({ tokenId }: PasswordResetFormProps) => {
  const [actionState, action] = useActionState(
    passwordReset.bind(null, tokenId),
    EMPTY_ACTION_STATE
  );

  const router = useRouter();

   
  // const [password, setPassword] = useState("");

  const passwordRef = useRef("");
  const [strength, setStrength] = useState<number | null>(null);

  useEffect(() => {
    const autoSignIn = async () => {
      if (actionState.status === "SUCCESS") {
        const email = actionState.data?.email;
        const password = passwordRef.current; 

        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.ok) {
          router.push(ticketsPath());
        } else {
          router.push(signInPath());
        }
      } else if (
        actionState.status === "ERROR" &&
        Object.keys(actionState.fieldErrors ?? {}).length === 0
      ) {
        router.push(passwordForgotPath());
      }
    };

    autoSignIn();
  }, [actionState, router]);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="password"
        name="password"
        placeholder="password"
        defaultValue={actionState.payload?.get("password") as string}
        onChange={(e) => {
          passwordRef.current = e.target.value;
          const result = checkPasswordStrength(e.target.value);
          setStrength(result.score);
        }}
      />
      <FieldError actionState={actionState} name="password" />

      <Input
        type="password"
        name="confirmPassword"
        placeholder="confirm Password"
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
          Password Strength:{" "}
          {["Very Weak", "Weak", "Fair", "Good", "Strong"][strength]}
        </div>
      )}

      {strength !== null && strength > 2 ? (
        <SubmitButton variant="default" label="Reset Password" />
      ) : (
        <Button disabled={true} variant="outline">
          Reset Password
        </Button>
      )}
    </Form>
  );
};
