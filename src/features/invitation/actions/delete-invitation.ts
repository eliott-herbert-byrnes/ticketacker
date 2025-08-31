import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import * as invitiationData from "../data";

type DeleteInvitationProps = {
  email: string;
  organizationId: string;
};

export const deleteInvitation = async ({
  email,
  organizationId,
}: DeleteInvitationProps) => {
  await getAdminOrRedirect(organizationId);

  const invitiation = await invitiationData.findEmailInvitiation(
    email,
    organizationId
  );

  if (!invitiation) {
    return toActionState("ERROR", "Invitation not found");
  }

  await invitiationData.deleteInvitation(email, organizationId);

  return toActionState("SUCCESS", "Invitation delete");
};
