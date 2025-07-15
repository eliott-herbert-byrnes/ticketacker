"use client";
import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/sumit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "../actions/sign-up";

const SignUpForm = () => {
  const [actionState, action] = useActionState(signUp, EMPTY_ACTION_STATE);

  return (
    <Form action={action} actionState={actionState}>
      <Label htmlFor="username">Username</Label>
      <Input
        name="username"
        placeholder="JohnDoe123"
        defaultValue={actionState.payload?.get("username") as string}
      />
      <FieldError actionState={actionState} name="username" />

      <Label htmlFor="email">Email</Label>
      <Input
        name="email"
        placeholder="JohnDoe123@gmail.com"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError actionState={actionState} name="email" />

      <Label htmlFor="password">Password</Label>
      <Input
        name="password"
        placeholder="ug@5yh4vb1j!k"
        type="password"
        defaultValue={actionState.payload?.get("password") as string}
      />
      <FieldError actionState={actionState} name="password" />

      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input
        name="confirmPassword"
        placeholder="ug@5yh4vb1j!k"
        type="password"
        defaultValue={actionState.payload?.get("confirmPassword") as string}

      />
      <FieldError actionState={actionState} name="confirmPassword" />

      <div className="mt-4">
        <SubmitButton label="Sign Up" />
      </div>
    </Form>
  );
};

export { SignUpForm };
