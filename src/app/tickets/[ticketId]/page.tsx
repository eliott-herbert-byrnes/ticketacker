import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { TicketItem } from "@/features/ticket/queries/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { authOptions } from "@/lib/authOptions";

type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  const session = await getServerSession(authOptions)
  const isAuthorised = isOwner(session, ticket)

  if (!ticket || !isAuthorised) {
    notFound()
  }
  
  return (
    <>
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail={true} />
    </div>
    
    </>
  );
};

export default TicketPage;
