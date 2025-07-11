

import { notFound } from "next/navigation";
import { ReDirectToast } from "@/components/redirect-toast";
import { TicketItem } from "@/features/ticket/queries/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";

type TicketPageProps = {
  params: {
    ticketId: string;
  };
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = params;
  const ticket = await getTicket(ticketId);

  if (!ticket) {
    notFound()
  }
  
  return (
    <>
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail={true} />
    </div>
    <ReDirectToast />
    </>
  );
};

export default TicketPage;
