import { PaginatedData } from "@/types/pagination";
import { CommentWithMetadata } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments } from "../../queries/get-comments";

const usePaginatedComments = (
  ticketId: string,
  paginatedComments: PaginatedData<CommentWithMetadata>
) => {
  const queryClient = useQueryClient();

  const { data = paginatedComments, isFetching } = useQuery<
    PaginatedData<CommentWithMetadata>
  >({
    queryKey: ["comments", ticketId],
    queryFn: () => getComments(ticketId),
    initialData: paginatedComments,
  });

  const createMutation = useMutation({
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

  const deleteMutation = useMutation({
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
  return {
    data,
    onCreateComment: createMutation.mutate,
    onDeleteComment: (id: string) => deleteMutation.mutate(id),
    handleMore,
    isFetching,
  };
};

export { usePaginatedComments };
