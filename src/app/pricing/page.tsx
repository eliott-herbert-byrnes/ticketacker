import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { Products } from "@/features/stripe/components/product";

export const revalidate = 0;
export const dynamic = "force-dynamic"

const pricingPage = async () => {
  const activeOrganization = await getActiveOrganization();

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Pricing Plans"
        description="Explore the pricing plans for Ticketacker"
      />
      <Suspense fallback={<Skeleton />}>
      <Products organizationId={activeOrganization?.id} />
      </Suspense>
    </div>
  );
};
export default pricingPage;
