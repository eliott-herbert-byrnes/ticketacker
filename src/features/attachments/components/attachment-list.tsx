"use client";
import { Attachment } from "@prisma/client";
import { AttachmentDeleteButton } from "./attachment-delete-button";
import { AttachmentItem } from "./attachment-item";

type AttachmentListProps = {
  attachments: Attachment[];
  isOwner: boolean;
  onDeleted?: () => void;
};

const AttachmentList = ({ attachments, isOwner, onDeleted }: AttachmentListProps) => {
  return (
    <div className="mx-2 flex flex-col gap-y-2 mb-4">
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          buttons={isOwner ? [<AttachmentDeleteButton key="del" id={attachment.id} onDeleted={onDeleted}/>] : []}
        />
      ))}
    </div>
  );
};

export { AttachmentList };
