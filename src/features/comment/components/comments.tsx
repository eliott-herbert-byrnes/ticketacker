"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function Comments({ ticketId, paginatedComments }: CommentProps) {
  const queryClient = useQueryClient();

  const { data = paginatedComments, isFetching } = useQuery<
    PaginatedData<CommentWithMetadata>
  >({
    queryKey: ["comments", ticketId],
    queryFn: () => getComments(ticketId),
    initialData: paginatedComments,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (comment: CommentWithMetadata) => comment,
    onSuccess: (comment) => {
      queryClient.setQueryData<PaginatedData<CommentWithMetadata>>(
        ["comments", ticketId],
        (old) =>
          old
            ? {
                ...old,
                list: [comment, ...old.list],
              }
            : {
                list: [comment],
                metadata: { count: 1, hasNextPage: false, cursor: undefined },
              }
      );
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: (id) => {
      queryClient.setQueryData<PaginatedData<CommentWithMetadata>>(
        ["comments", ticketId],
        (old) =>
          old
            ? {
                ...old,
                list: old.list.filter((comment) => comment.id !== id),
              }
            : old
      );
    },
  });

  const handleMore = async () => {
    if (data.metadata.hasNextPage) {
      const morePaginatedComments = await getComments(
        ticketId,
        data.metadata.cursor
      );
      queryClient.setQueryData<PaginatedData<CommentWithMetadata>>(
        ["comments", ticketId],
        (old) =>
          old
            ? {
                list: [...old.list, ...morePaginatedComments.list],
                metadata: morePaginatedComments.metadata,
              }
            : morePaginatedComments
      );
    }
  };

  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={(comment) => {
              if (comment) {
                createCommentMutation.mutate(comment);
              }
            }}
          />
        }
      />

      <div className="flex flex-col gap-y-4 w-full">
        {data.list.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwner={comment.isOwner}
            onDeleteComment={() => deleteCommentMutation.mutate(comment.id)}
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
