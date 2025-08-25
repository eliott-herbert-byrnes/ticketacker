"use client";

import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { createInvitiation } from "../actions/create-invitation";
import { InvitationDialog } from "@/components/invitation-dialog";

type InvitationCreateButtonProps = {
  organizationId: string;
};

const InvitationCreateButton = ({
  organizationId,
}: InvitationCreateButtonProps) => {

  const [actionState, action] = useActionState(
    createInvitiation.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );

  return (
    <InvitationDialog
      title="Invite Member"
      description="Invite a user by email to your organization"
      action={action}
      actionState={actionState}
    />
  );
};

export { InvitationCreateButton };
