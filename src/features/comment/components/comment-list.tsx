
"use client"
// import { AttachmentCreateButton } from "@/features/attachments/components/attachment-create-button";
import { AttachmentList } from "@/features/attachments/components/attachment-list";
import { CommentWithMetadata } from "../types";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";

type CommentListProps = {
  comments: CommentWithMetadata[];
  onDeleteComment: (id: string) => void;
  onAttachmentsChanged?: () => void;
};

const CommentList = ({ comments, onDeleteComment, onAttachmentsChanged }: CommentListProps) => (
  <>
    {comments.map((comment) => {
      const buttons = comment.isOwner ? [
        // <AttachmentCreateButton key="0" entityId={comment.id} entity="COMMENT" onChanged={onAttachmentsChanged} />,
        <CommentDeleteButton key="1" id={comment.id} onDeleteComment={onDeleteComment} />,
      ] : [];

      const sections = [];
      if (comment.attachments?.length) {
        sections.push({
          label: "Attachments",
          content: (
            <AttachmentList
              attachments={comment.attachments}
              isOwner={comment.isOwner}
              onDeleted={onAttachmentsChanged}
            />
          ),
        });
      }

      return (
        <CommentItem
          key={comment.id}
          comment={comment}
          buttons={buttons}
          sections={sections}
        />
      );
    })}
  </>
);

export { CommentList };