"use client";
import { useState } from "react";
import { CardCompact } from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { PaginatedData } from "@/types/pagination";
import { getComments } from "../queries/get-comments";
import { CommentWithMetadata } from "../types";
import { CommentCreateForm } from "./comment-create-form";
import { CommentItem } from "./comment-item";

type CommentProps = {
  ticketId: string;
  paginatedComments: PaginatedData<CommentWithMetadata>;
};

const Comments = ({ ticketId, paginatedComments }: CommentProps) => {
  const [comments, setComments] = useState(paginatedComments.list);
  const [metadata, setMetadata] = useState(paginatedComments.metadata);

  const handleMore = async () => {
    const morePaginatedComments = await getComments(ticketId, metadata.cursor);
    const moreComments = morePaginatedComments.list;

    setComments([...comments, ...moreComments]);
    setMetadata(morePaginatedComments.metadata);
  };

  const handleDeleteComment = (id: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
  };

  const handleCreateComment = (comment: CommentWithMetadata | undefined) => {
    if(!comment) return;
    
    setComments((prevComments) => [comment, ...prevComments]);
  };

  return (
    <>
        <CardCompact
          title="Create Comment"
          description="A new comment will be created"
          content={
            <CommentCreateForm
              ticketId={ticketId}
              onCreateComment={handleCreateComment}
            />
          }
        />
        
      <div className="flex flex-col gap-y-4 w-full">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwner={comment.isOwner}
            onDeleteComment={handleDeleteComment}
          />
        ))}
      </div>
      
      <div className="flex flex-col justify-center">
        {metadata.hasNextPage && (
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={handleMore}
          >
            More
          </Button>
        )}
      </div>


    </>
  );
};

export { Comments };
