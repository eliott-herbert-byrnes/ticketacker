"use client";

import clsx from "clsx";
import {useEffect, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/sumit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { passwordChange } from "../actions/password-change";
import { checkPasswordStrength } from "../utils/password-strength";

export const PasswordChangeForm = () => {
  const [actionState, action] = useActionState(
    passwordChange,
    EMPTY_ACTION_STATE
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<number | null>(null);

  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      // redirect(signInPath());
      console.log("Success");
    } else if (
      actionState.status === "ERROR" &&
      Object.keys(actionState.fieldErrors ?? {}).length === 0
    ) {
      // redirect(passwordForgotPath());
      console.log("Error");
    }
  }, [actionState.fieldErrors, actionState.status]);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        defaultValue={actionState.payload?.get("currentPassword") as string}
      />
      <FieldError actionState={actionState} name="currentPassword" />

      <Input
        type="password"
        name="password"
        placeholder="New Password"
        defaultValue={actionState.payload?.get("password") as string}
        onChange={(e) => {
          const val = e.target.value;
          setPassword(val);
          const result = checkPasswordStrength(val);
          setStrength(result.score);
        }}
      />
      <FieldError actionState={actionState} name="password" />

      <Input
        type="password"
        name="confirmPassword"
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
          Password Strength:{" "}
          {["Very Weak", "Weak", "Fair", "Good", "Strong"][strength]}
        </div>
      )}
      {strength !== null && strength > 2 ? (
        <SubmitButton variant="default" label="Change Password" />
      ) : (
        <Button disabled={true} variant="outline">
          Change Password
        </Button>
      )}
    </Form>
  );
};
