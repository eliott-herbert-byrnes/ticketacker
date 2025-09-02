import { notFound } from "next/navigation";
import { homePath, ticketsPath } from "@/app/paths";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { Heading } from "@/components/Heading";

type TicketEditPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  if (!ticket || !ticket.isOwner) {
    notFound();
  }

  const breadcrumbs = (
    <div className="mb-2">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath() },
          { title: ticket.title, href: ticketsPath() },
          { title: "Edit" },
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

      <div className="flex-1 flex flex-col items-center">
        <CardCompact
          title="Edit Ticket"
          description="Edit an existing ticket"
          content={<TicketUpsertForm ticket={ticket} />}
          className="w-full max-w-[420px] animate-fade-from-top"
        />
      </div>
    </div>
  );
};

export default TicketEditPage;
