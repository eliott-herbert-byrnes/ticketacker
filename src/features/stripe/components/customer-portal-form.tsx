'use client'
import { Form } from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Button } from "@/components/ui/button";
import { createCustomerPortal } from "../actions/create-customer-portal";

type CustomerPortalFormProps = {
  organizationId: string | null | undefined;
  children: React.ReactNode;
  className?: string;
};

const CustomerPortalForm = ({
  organizationId,
  children,
  className,
}: CustomerPortalFormProps) => {
  const [actionState, action] = useActionState(
    createCustomerPortal.bind(null, organizationId),
    EMPTY_ACTION_STATE
  );

  return (
    <Form action={action} actionState={actionState}>
      <Button type="submit" className={className}>{children}</Button>
    </Form>
  );
};

export { CustomerPortalForm };
