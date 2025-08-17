import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const sortParser = {
  sortKey: parseAsString.withDefault("createdAt"),
  sortValue: parseAsString.withDefault("desc"),
};

export const paginationParser = {
  page: parseAsInteger.withDefault(0),
  size: parseAsInteger.withDefault(5),
};

export const orgParser = {
  org: parseAsString.withDefault("all"),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const sortOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const orgOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const searchParamsCache = createSearchParamsCache({
  search: searchParser,
  ...sortParser,
  ...paginationParser,
  ...orgParser, // NEW
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
