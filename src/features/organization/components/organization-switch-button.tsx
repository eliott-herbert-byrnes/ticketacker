"use client";

import { Form } from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { switchOrganization } from "../actions/switch-organization";

type OrganizationSwitchButtonTypes = {
  organizationId: string;
  trigger: React.ReactElement;
};

const OrganizationSwitchButton = ({
  organizationId,
  trigger,
}: OrganizationSwitchButtonTypes) => {
  const [actionState, action] = useActionState(
    switchOrganization.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );
  return (
    <Form action={action} actionState={actionState}>
      {trigger}
    </Form>
  );
};

export { OrganizationSwitchButton };
