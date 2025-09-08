import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
import { getOrgStripeFeatures } from "@/features/stripe/queries/get-org-features";
import { TicketList } from "@/features/ticket/components/ticket-list";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { searchParamsCache } from "@/features/ticket/queries/search-params";

type TicketsPageProps = {
  searchParams: SearchParams;
};

const TicketsPage = async ({ searchParams }: TicketsPageProps) => {
  const { user } = await getAuth();

  const orgs = user ? await getOrganizationsByUser() : [];
  const activeOrg = orgs.find(o => o.membershipByUser.isActive) ?? null;

  const {canMakePrivateTickets} = await getOrgStripeFeatures(activeOrg?.id)

  return (
    <>
      <div className="flex-1 flex flex-col gap-y-8">
        <Heading
          title="My Tickets"
          description="All of your tickets in one place"
        />

        <CardCompact
          title="Create Ticket"
          description="A new ticket will be created"
          content={<TicketUpsertForm canMakePrivateTickets={canMakePrivateTickets}/>}
          className={"self-center w-full max-w-[420px]"}
        />

        <Suspense fallback={<Spinner />}>
          <TicketList
            userId={user?.id}
            searchParams={await searchParamsCache.parse(searchParams)}
          />
        </Suspense>
      </div>
    </>
  );
};

export default TicketsPage;
