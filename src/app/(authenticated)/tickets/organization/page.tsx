import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/Heading";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
import { getOrgStripeFeatures } from "@/features/stripe/queries/get-org-features";
import { TicketList } from "@/features/ticket/components/ticket-list";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { searchParamsCache } from "@/features/ticket/queries/search-params";

type TicketsByOrganizationPageProps = {
  searchParams: Promise<SearchParams>;
};

const TicketsByOrganizationPage = async ({
  searchParams,
}: TicketsByOrganizationPageProps) => {
  const { user } = await getAuth();

  const orgs = user ? await getOrganizationsByUser() : [];
  const activeOrg = orgs.find((o) => o.membershipByUser.isActive) ?? null;

  const { canMakePrivateTickets } = await getOrgStripeFeatures(activeOrg?.id);

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Our Tickets"
        description="All tickets related to my organization"
      />

        <CardCompact
          title="Create Ticket"
          description="A new ticket will be created"
          className="w-full max-w-[420px] self-center"
          content={
            <TicketUpsertForm canMakePrivateTickets={canMakePrivateTickets} />
          }
        />

        <Suspense fallback={<Skeleton />}>
          <TicketList
            byOrganization
            searchParams={searchParamsCache.parse(await searchParams)}
          />
        </Suspense>
      </div>
  );
};

export default TicketsByOrganizationPage;
