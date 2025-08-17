"use client";

import { LucideBan, LucideCheck } from "lucide-react";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import {
  PermissionKey,
} from "@/features/ticket/permissions/keys/permission-keys";
import { togglePermission } from "../actions/toggle-permission";

type PermissionToggleProps = {
  userId: string;
  organizationId: string;
  permissionKey: PermissionKey;
  permissionValue: boolean;
};

const PermissionToggle = ({
  userId,
  organizationId,
  permissionKey,
  permissionValue,
}: PermissionToggleProps) => {
  const [actionState, action] = useActionState(
    togglePermission.bind(null, {
      userId,
      organizationId,
      permissionKey,
    }),
    EMPTY_ACTION_STATE
  );

  // tracks state of permission
  const isOn = !!permissionValue;

  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton
        icon={isOn ? <LucideCheck /> : <LucideBan />}
        size="icon"
        variant={permissionValue ? "secondary" : "outline"}
      />
    </Form>
  );
};

export { PermissionToggle };
