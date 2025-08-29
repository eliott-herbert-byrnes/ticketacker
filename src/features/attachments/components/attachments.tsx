import { AttachmentEntity } from "@prisma/client";
import { CardCompact } from "@/components/card-compact";
import { getAttachments } from "../queries/get-attachments";
import { AttachmentCreateForm } from "./attachment-create-form";
import { AttachmentList } from "./attachment-list";

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
          <AttachmentList attachments={attachments} isOwner={isOwner} />
          {isOwner && <AttachmentCreateForm entity={entity} entityId={entityId} />}
        </>
      }
    />
  );
};

export { Attachments };
