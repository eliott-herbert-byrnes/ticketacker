import { Attachment } from "@prisma/client";
import { LucideArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { attachmentDownloadPath } from "@/app/paths";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <Link
        className="flex gap-x-2 items-center text-sm truncate"
        href={attachmentDownloadPath(attachment.id)}
      >
        <LucideArrowUpRightFromSquare className="w-4 h-4" />
        {attachment.name}
      </Link>
      {buttons}
    </div>
  );
};

export { AttachmentItem };
