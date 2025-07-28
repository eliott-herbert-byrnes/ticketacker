import { CardCompact } from "@/components/card-compact";
import { CommentWithMetadata } from "../types";
import { CommentCreateForm } from "./comment-create-form";
import { CommentItem } from "./comment-item";

type CommentProps = {
  ticketId: string;
  comments?: CommentWithMetadata[];
};

const Comments =  ({ ticketId, comments = [] }: CommentProps) => {
  return (
    <>
      <div className="flex flex-col gap-y-4 w-full">
        {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={comment.isOwner}
        />

        ))}
      </div>

      <CardCompact
        title="Create Comment"
        description="A new comment will be created"
        content={<CommentCreateForm ticketId={ticketId} />}
      />
    </>
  );
};

export { Comments };
