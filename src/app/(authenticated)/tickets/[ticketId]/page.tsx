import { notFound } from "next/navigation";
import { homePath } from "@/app/paths";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { Comments } from "@/features/comment/components/comments";
import { getComments } from "@/features/comment/queries/get-comments";
import { TicketItem } from "@/features/ticket/queries/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";


type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const ticketPromise = getTicket(ticketId);
  const commentsPromise = getComments(ticketId);

  const [ticket, comments] = await Promise.all([ticketPromise, commentsPromise])


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
        <TicketItem ticket={ticket} isDetail={true} comments={<Comments ticketId={ticket.id} comments={comments}/>}/>
      </div>
    </div>
  );
};

export default TicketPage;
