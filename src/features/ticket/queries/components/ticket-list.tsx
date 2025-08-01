import { Placeholder } from "@/components/Placeholder";
import { getTickets } from "../get-tickets";
import { ParsedSearchParams } from "../search-params";
import { TicketItem } from "./ticket-item";
import { TicketPagination } from "./ticket-pagination";
import { TicketSearchInput } from "./ticket-search-input";
import { TicketSortSelect } from "./ticket-sort-select";

type TicketListProps = {
  userId?: string;
  searchParams: ParsedSearchParams;
};

const TicketList = async ({ userId, searchParams }: TicketListProps) => {
  const {list: tickets, metadata: ticketMetaData} = await getTickets(userId, searchParams);

  return (
    <div className="flex-1 flex flex-col items-center gap-y-3 opacity-0 animate-[fade-from-top_1.0s_ease-out_forwards]">
      <div className="max-w-[420px] w-full mb-3 flex flex-row gap-x-2">
        <TicketSearchInput placeholder="Search tickets ..." />
        <TicketSortSelect
          options={[
            {
              sortKey: "createdAt",
              sortValue: "desc",
              label: "Newest",
            },
            {
              sortKey: "createdAt",
              sortValue: "asc",
              label: "Oldest",
            },
            {
              sortKey: "bounty",
              sortValue: "desc",
              label: "Bounty",
            },
            {
              sortKey: "status",
              sortValue: "asc",
              label: "Status",
            },
          ]}
        />
      </div>
      {tickets.length ? (
        tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
      ) : (
        <Placeholder label="No tickets found" />
      )}

      <div className="w-full md:w-5/6 md:max-w-[420px] mt-2">
        <TicketPagination paginatedTicketMetadata={ticketMetaData}/>
      </div>
    </div>
  );
};

export { TicketList };
