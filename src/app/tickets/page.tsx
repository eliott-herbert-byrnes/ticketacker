import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { TicketList } from "@/features/ticket/queries/components/ticket-list";

const TicketsPage = () => {
  
  return (
    <div className="flex-1 flex flex-col gap-y-8">

      <Heading 
      title='Tickets Page'
      description='All of your tickets'
      />

      <Suspense fallback={<Spinner />}>
        <TicketList />
      </Suspense>
    </div>
  );
};

export default TicketsPage;
