"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { inngest } from "@/lib/inngest";
import * as attachmentData from "../data"
import { getOrganizationIdByAttachment } from "../utils/attachment-helper";

export const deleteAttachment = async (id: string) => {
  const { user } = await getAuthOrRedirect();

  const attachment = await attachmentData.OrganizationIdByAttachment(id)

  const subject = attachment.ticket ?? attachment.comment;

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not authorised");
  }

  try {
    await attachmentData.deleteAttachment(id);

    const organizationId = getOrganizationIdByAttachment(
      attachment.entity,
      subject
    );

    await inngest.send({
      name: "app/attachment.deleted",
      data: {
        organizationId,
        entityId: subject.id,
        entity: attachment.entity,
        fileName: attachment.name,
        attachmentId: attachment.id,
      },
    });
  } catch (error) {
   return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Attachment deleted");
};
