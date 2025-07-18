
import { getTickets } from "../get-tickets";
import { TicketItem } from "./ticket-item";

type TicketListProps = {
  userId?: string
}

const TicketList = async ({userId}: TicketListProps) => {
  const tickets = await getTickets(userId)

  return (
  <div className="flex-1 flex flex-col items-center gap-y-4 opacity-0 animate-[fade-from-top_1.0s_ease-out_forwards]">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export {TicketList}