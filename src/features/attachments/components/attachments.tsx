import { CardCompact } from "@/components/card-compact";
import { AttachmentCreateForm } from "./attachment-create-form";
import { getAttachments } from "../queries/get-attachments";
import { AttachmentItem } from "./attachment-item";
import { AttachmentDeleteButton } from "./attachment-delete-button";
import { AttachmentEntity } from "@prisma/client";

type AttachmentProps = {
  entity: AttachmentEntity;
  entityId: string;
  isOwner: boolean;
};

const Attachments = async ({ entityId, entity, isOwner }: AttachmentProps) => {
  const attachments = await getAttachments(entity, entityId);

  return (
    <CardCompact
      title="Attachments"
      description="Attached images or PDFs"
      content={
        <>
          <div className="mx-2 flex flex-col gap-y-2 mb-2">
            {attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
                buttons={[
                  ...(isOwner
                    ? [<AttachmentDeleteButton key="0" id={attachment.id} />]
                    : []),
                ]}
              />
            ))}
          </div>

          {isOwner && <AttachmentCreateForm entity={entity} entityId={entityId} />}
        </>
      }
    />
  );
};

export { Attachments };
