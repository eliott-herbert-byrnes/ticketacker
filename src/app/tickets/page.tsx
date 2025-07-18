export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { TicketList } from "@/features/ticket/queries/components/ticket-list";
import { TicketUpsertForm } from "@/features/ticket/queries/components/ticket-upsert-form";

const TicketsPage = async () => {

  const {user} = await getAuth()

  return (
    <>
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="My Tickets" description="All of your tickets in one place" />

      <CardCompact 
        title='Create Ticket'
        description='A new ticket will be created' 
        content={<TicketUpsertForm />} 
        className={"self-center w-full max-w-[420px]"}
      />

      <Suspense fallback={<Spinner />}>
        <TicketList userId={user?.id}/>
      </Suspense>
    </div>
    
    </>
  );
};

export default TicketsPage;
