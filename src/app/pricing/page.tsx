import { Heading } from "@/components/Heading";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { Products } from "@/features/stripe/components/product";

const pricingPage = async () => {
  const activeOrganization = await getActiveOrganization();

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Pricing Plans"
        description="Explore the pricing plans for Ticketacker"
      />

      <Products organizationId={activeOrganization?.id} />
    </div>
  );
};
export default pricingPage;
