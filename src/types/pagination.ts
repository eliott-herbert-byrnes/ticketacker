export type PaginatedData<T, C = string> = {
  list: T[];
  metadata: {
    count: number;
    hasNextPage: boolean;
    cursor?: C | undefined;
  };
};
