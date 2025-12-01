import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { PaginatedData } from "@/types/pagination";
import { getComments } from "../../queries/get-comments";
import { CommentWithMetadata } from "../../types";

type CommentsPage = {
  list: CommentWithMetadata[];
  metadata: { count: number; hasNextPage: boolean; cursor?: string };
};

export const usePaginatedComments = (
  ticketId: string,
  paginatedComments: PaginatedData<CommentWithMetadata>
) => {
  const queryKey = ["comments", ticketId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      placeholderData: {
        pages: [
          {
            list: paginatedComments.list,
            metadata: paginatedComments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const comments = data?.pages.flatMap((page) => page.list);

  const queryClient = useQueryClient();

  const prependComment = (newComment: CommentWithMetadata) => {
    queryClient.setQueryData<InfiniteData<CommentsPage>>(queryKey, (prev) => {
      if (!prev) return prev;
      const first = prev.pages[0];
      const exists = first.list.some((c) => c.id === newComment.id);
      if (exists) return prev;
      const updatedFirst: CommentsPage = { ...first, list: [newComment, ...first.list] };
      return { ...prev, pages: [updatedFirst, ...prev.pages.slice(1)] };
    });
  };

  const removeComment = (commentId: string) => {
    queryClient.setQueryData<InfiniteData<CommentsPage>>(queryKey, (prev) => {
      if (!prev) return prev;
      
      return {
        ...prev,
        pages: prev.pages.map((page) => ({
          ...page,
          list: page.list.filter((c) => c.id !== commentId),
        })),
      };
    });
  };

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment: async (c?: CommentWithMetadata) => {
      if (c) {
        prependComment(c);
      }
      await queryClient.invalidateQueries({ queryKey });
    },
    onDeleteComment: async (id: string) => {
      removeComment(id);
      await queryClient.invalidateQueries({ queryKey });
    },
    onCreateAttachment: () => queryClient.invalidateQueries({ queryKey }),
    onDeleteAttachment: () => queryClient.invalidateQueries({ queryKey }),
  };
};