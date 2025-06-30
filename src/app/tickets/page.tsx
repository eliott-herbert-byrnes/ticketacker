"use client";

import { Heading } from "@/components/Heading";
import { ticketData } from "@/data/data";
import { TicketItem } from "@/features/ticket/components/ticket-item";

const TicketsPage = () => {
  return (
    <div className="flex-1 flex flex-col gap-y-8">

      <Heading 
      title='Tickets Page'
      description='All of your tickets'
      />

      <div className="flex-1 flex flex-col items-center gap-y-4 animate-fade-from-top">
        {ticketData.map((ticket) => (

          <TicketItem key={ticket.id} ticket={ticket} />

        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
