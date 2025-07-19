
import { Placeholder } from "@/components/Placeholder";
import { SearchInput } from "@/components/search-input";
import { SortSelect } from "@/components/sort-select";
import { getTickets } from "../get-tickets";
import { SearchParams } from "../search-params";
import { TicketItem } from "./ticket-item";


type TicketListProps = {
  userId?: string
  searchParams: SearchParams
}

const TicketList = async ({userId, searchParams}: TicketListProps) => {
  const tickets = await getTickets(userId, searchParams)

  return (
  <div className="flex-1 flex flex-col items-center gap-y-4 opacity-0 animate-[fade-from-top_1.0s_ease-out_forwards]">
    <div className="max-w-[420px] w-full mb-3 flex flex-row gap-x-2">
      <SearchInput placeholder="Search tickets ..." />
         <SortSelect
          defaultValue="newest"
          options={[
            { value: "newest", label: "Newest" },
            { value: "bounty", label: "Bounty" },
          ]}
        />
    </div>
      {tickets.length ? tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      )): (
        <Placeholder label="No tickets found" />
      )}
    </div>
  );
};

export {TicketList}