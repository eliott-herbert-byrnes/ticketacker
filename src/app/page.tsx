import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { TicketList } from "@/features/ticket/components/ticket-list";
import { searchParamsCache } from "@/features/ticket/queries/search-params";

type HomePageProps = {
  searchParams: SearchParams
}

const Homepage = async ({ searchParams }: HomePageProps ) => {

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="All Tickets"
        description="Tickets by everyone in one place"
      />

      <Suspense fallback={<Spinner />}>
        <TicketList searchParams={await searchParamsCache.parse(searchParams)} />
      </Suspense>
    </div>
  );
};

export default Homepage;
