import { notFound } from "next/navigation";
import { homePath } from "@/app/paths";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { Comments } from "@/features/comment/components/comments/comments";
import { getComments } from "@/features/comment/queries/get-comments";
import { TicketItem } from "@/features/ticket/queries/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { Attachments } from "@/features/attachments/components/attachments";
import { Heading } from "@/components/Heading";

type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketPage = async ({ params }: TicketPageProps) => {
  const { ticketId } = await params;
  const ticketPromise = getTicket(ticketId);
  const commentsPromise = getComments(ticketId);

  const [ticket, paginatedComments] = await Promise.all([
    ticketPromise,
    commentsPromise,
  ]);

  if (!ticket) {
    notFound();
  }

  const breadcrumbs = (
    <div className="mb-2">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath() },
          { title: ticket.title },
        ]}
      />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col gap-y-8 ml-6">
      <Heading
        title={ticket.title}
        description="Change status, upload attachments, or create comments"
        tabs={breadcrumbs}
      />

      <div className="flex justify-center animate-fade-from-top">
        <TicketItem
          ticket={ticket}
          isDetail={true}
          comments={
            <Comments
              ticketId={ticket.id}
              paginatedComments={paginatedComments}
            />
          }
          attachments={
            <Attachments entityId={ticket.id} entity="TICKET" isOwner={ticket.isOwner} />
          }
        />
      </div>
    </div>
  );
};

export default TicketPage;
