import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { getAuth } from "@/features/auth/queries/get-auth";
import { TicketList } from "@/features/ticket/components/ticket-list";
import { searchParamsCache } from "@/features/ticket/queries/search-params";
import { signInPath } from "./paths";

type HomePageProps = {
  searchParams: SearchParams;
};

const Homepage = async ({ searchParams }: HomePageProps) => {
  const { user } = await getAuth();

  if (!user) {
    redirect(signInPath());
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="All Tickets"
        description="Tickets by everyone in one place"
      />

      <Suspense fallback={<Spinner />}>
        <TicketList
          searchParams={await searchParamsCache.parse(searchParams)}
        />
      </Suspense>
    </div>
  );
};

export default Homepage;
