"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Input } from "@/components/ui/input";
import { createOrganization } from "../actions/create-organization";

export function OrganizationCreateForm() {
  const router = useRouter();
  const [actionState, action] = useActionState(
    createOrganization,
    EMPTY_ACTION_STATE
  );

  useEffect(() => {
    if (actionState.status !== "SUCCESS") return;

    const to = actionState.data?.redirectTo;
    if (to) router.replace(to);
  }, [actionState.status, actionState.data?.redirectTo, router]);

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="name"
        placeholder="Name"
        defaultValue={actionState.payload?.get("name") as string}
        className=""
      />
      <FieldError actionState={actionState} name="name" />

      <div className="mt-2">
        <SubmitButton label="Create" />
      </div>
    </Form>
  );
}
