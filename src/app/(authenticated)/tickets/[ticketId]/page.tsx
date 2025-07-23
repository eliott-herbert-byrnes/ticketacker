import { notFound } from "next/navigation";
// import { getServerSession } from "next-auth";
import { homePath } from "@/app/paths";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
// import { isOwner } from "@/features/auth/utils/is-owner";
import { TicketItem } from "@/features/ticket/queries/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
// import { authOptions } from "@/lib/authOptions";


type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);


  // Temporarily removed isOwner auth check, as throws
  // 'Ticket Not Found' error for isDetail page, when
  // logged in as non-admin user. 

  // const session = await getServerSession(authOptions);
  // const isAuthorised = isOwner(session?.user, ticket);
  
  // if (!ticket || !isAuthorised) {
  //   notFound();
  // }

  if (!ticket) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8 ml-6">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath() },
          { title: ticket.title },
        ]}
      />

      <Separator />

      <div className="flex justify-center animate-fade-from-top">
        <TicketItem ticket={ticket} isDetail={true} />
      </div>
    </div>
  );
};

export default TicketPage;
