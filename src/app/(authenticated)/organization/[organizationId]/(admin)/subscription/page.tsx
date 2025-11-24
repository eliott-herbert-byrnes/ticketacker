import { LucideSettings } from "lucide-react";
import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
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

  const organization = await getOrganizationsByUser();

  const organizationName =
    organization.find((o) => o.id === organizationId)?.name ?? "Organization";

  const breadcrumbs = (
    <div className="mb-2">
      <OrganizationBreadcrumbs organizationName={organizationName} />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Subscription"
        description="Manage your subscriptions"
        tabs={breadcrumbs}
        actions={
          <CustomerPortalForm className="text-xs h-8" organizationId={organizationId}>
            <>
              <LucideSettings className="w-4 h-4" />
              Manage Subscriptions
            </>
          </CustomerPortalForm>
        }
      />

      <Suspense fallback={<Skeleton />}>
        <Products organizationId={organizationId} />
      </Suspense>

    </div>
  );
};

export default SubscriptionPage;
