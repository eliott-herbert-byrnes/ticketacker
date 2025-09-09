import { LucideSettings } from "lucide-react";
import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { CustomerPortalForm } from "@/features/stripe/components/customer-portal-form";
import { Products } from "@/features/stripe/components/product";
import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type SubscriptionPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export const revalidate = 0;
export const dynamic = "force-dynamic"

const SubscriptionPage = async ({ params }: SubscriptionPageProps) => {
  const { organizationId } = await params;

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Subscription"
        description="Manage your subscriptions"
        tabs={<OrganizationBreadcrumbs />}
        actions={
          <CustomerPortalForm organizationId={organizationId}>
            <>
              <LucideSettings className="w-4 h-4" />
              Manage Subscriptions
            </>
          </CustomerPortalForm>
        }
      />

      <Suspense fallback={<Spinner />}>
        <Products organizationId={organizationId} />
      </Suspense>

    </div>
  );
};

export default SubscriptionPage;
