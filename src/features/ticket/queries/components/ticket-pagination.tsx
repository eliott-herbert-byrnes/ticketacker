"use client";

import { useQueryState, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import { Pagination } from "@/components/pagination";
import { PaginatedData } from "@/types/pagination";
import { TicketWithMetadata } from "../../types";
import {
  paginationOptions,
  paginationParser,
  searchParser,
} from "../search-params";

type TicketPaginationProps = {
  paginatedTicketMetadata: PaginatedData<TicketWithMetadata>["metadata"]
};

const TicketPagination = ({
  paginatedTicketMetadata,
}: TicketPaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions
  );

  const [search] = useQueryState("search", searchParser);

  const prevSearch = useRef(search);

  useEffect(() => {
    if (search === prevSearch.current) return;

    prevSearch.current = search;

    setPagination({ ...pagination, page: 0 });
  }, [pagination, search, setPagination]);

  return (
    <Pagination
      paginatedMetaData={paginatedTicketMetadata}
      pagination={pagination}
      onPagination={setPagination}
    />
  );
};

export { TicketPagination };
