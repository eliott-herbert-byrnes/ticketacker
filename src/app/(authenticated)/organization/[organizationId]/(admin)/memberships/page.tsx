import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { Badge } from "@/components/ui/badge";
import { InvitationCreateButton } from "@/features/invitation/components/invitation-create-button";
import { MembershipList } from "@/features/membership/components/membership-list";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
import { OrganizationBreadcrumbs } from "../_navigation/tabs";
import { AdminButton } from "@/components/admin-button";

type MembershipsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const MembershipsPage = async ({ params }: MembershipsPageProps) => {
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
        title="Memberships"
        description="Manage members in your organization"
        actions={<AdminButton organizationId={organizationId} />}
        tabs={breadcrumbs}
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
