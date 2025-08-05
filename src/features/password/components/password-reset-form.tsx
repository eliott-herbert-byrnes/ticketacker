"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { passwordForgotPath, signInPath } from "@/app/paths";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/sumit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Input } from "@/components/ui/input";
import { passwordReset } from "../actions/password-reset";

type PasswordResetFormProps = {
  tokenId: string;
};

export const PasswordResetForm = ({ tokenId }: PasswordResetFormProps) => {
  const [actionState, action] = useActionState(
    passwordReset.bind(null, tokenId),
    EMPTY_ACTION_STATE
  );

    useEffect(() => {
    if (actionState.status === "SUCCESS") {
      redirect(signInPath());
    } else if (actionState.status === "ERROR"){
      redirect(passwordForgotPath())
    }
  }, [actionState.status]);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="password"
        name="password"
        placeholder="password"
        defaultValue={actionState.payload?.get("password") as string}
      />
      <FieldError actionState={actionState} name="password" />

      <Input
        type="password"
        name="confirmPassword"
        placeholder="confirm Password"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      <SubmitButton label="Reset Password" />
    </Form>
  );
};
