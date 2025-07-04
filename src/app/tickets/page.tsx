import { Suspense } from "react";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { CreateTicketForm } from "@/features/ticket/queries/components/ticket-create-form";
import { TicketList } from "@/features/ticket/queries/components/ticket-list";

const TicketsPage = () => {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="Tickets Page" description="All of your tickets" />

      <CardCompact 
        title='Create Ticket'
        description='A new ticket will be created' 
        content={<CreateTicketForm />} 
        className={"self-center w-full max-w-[420px]"}
      />

      <Suspense fallback={<Spinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
