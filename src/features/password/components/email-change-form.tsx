"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailChange } from "@/features/auth/actions/email-change";

export const EmailChangeForm = () => {
  const router = useRouter();

  const [actionState, action] = useActionState(emailChange, EMPTY_ACTION_STATE);

  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      router.refresh();

      if (actionState.data?.redirectTo) {
        router.push(actionState.data.redirectTo);
      }
    }
  }, [actionState, router]);;

  return (
    <Form action={action} actionState={actionState}>
      <Input
        type="email"
        name="email"
        placeholder="New Email"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError actionState={actionState} name="email" />

      <Button className="cursor-pointer" variant="default">
        Verify Email
      </Button>
    </Form>
  );
};
