
import Link from "next/link";
import { ticketsPath } from "@/app/paths";
import { Placeholder } from "@/components/Placeholder";
import { Button } from "@/components/ui/button";
import { ticketData } from "@/data/data";
import { TicketItem } from "@/features/ticket/components/ticket-item";

type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;

  const ticket = ticketData.find((ticket) => ticket.id === ticketId)

  if(!ticket){
    return (
    <Placeholder 
    label='Ticket Not Found'
    button={
      <Button asChild>
        <Link href={ticketsPath()}>Go to Tickets</Link>
      </Button>
    }
    />
  )
  }

  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail={true}/>
    </div>
  );
};

export default TicketPage;
