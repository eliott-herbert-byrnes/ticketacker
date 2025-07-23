import { CardCompact } from "@/components/card-compact";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getComments } from "../queries/get-comments";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";


type CommentProps = {
  ticketId: string;
};

const Comments = async ({ ticketId }: CommentProps) => {
  const { user } = await getAuth();
  const comments = await getComments(ticketId);

  return (
    <>
      <div className="flex flex-col gap-y-4 w-full">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            buttons={[...(isOwner(user, comment) ? [<CommentDeleteButton key="0" id={comment.id}/>] : [])]}
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
