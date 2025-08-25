"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardCompact } from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { PaginatedData } from "@/types/pagination";
import { getComments } from "../../queries/get-comments";
import { CommentWithMetadata } from "../../types";
import { CommentCreateForm } from "../comment-create-form";
import { CommentItem } from "../comment-item";
import { usePaginatedComments } from "./use-paginated-comments";

type CommentProps = {
  ticketId: string;
  paginatedComments: PaginatedData<CommentWithMetadata>;
};

export function Comments({ ticketId, paginatedComments }: CommentProps) {
  const { data, onCreateComment, onDeleteComment, isFetching, handleMore } =
    usePaginatedComments(ticketId, paginatedComments);

  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={onCreateComment}
          />
        }
      />

      <div className="flex flex-col gap-y-4 w-full">
        {data.list.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwner={comment.isOwner}
            onDeleteComment={onDeleteComment}
          />
        ))}
      </div>

      <div className="flex flex-col justify-center">
        {data.metadata.hasNextPage && (
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={handleMore}
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "More"}
          </Button>
        )}
      </div>
    </>
  );
}
