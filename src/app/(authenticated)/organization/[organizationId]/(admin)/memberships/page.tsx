import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { Badge } from "@/components/ui/badge";
import { InvitationCreateButton } from "@/features/invitation/components/invitation-create-button";
import { MembershipList } from "@/features/membership/components/membership-list";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
import { OrganizationBreadcrumbs } from "../(admin)/_navigation/tabs";

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

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        // badge={
        //   <div className="pr-6">
        //     <Badge variant="default" className="h-6 ">
        //       <p className="text-xs">Admin area</p>
        //     </Badge>
        //   </div>
        // }
        title="Memberships"
        description="Manage members in your organization"
        actions={
          <div>
          <div className="flex flex-row items-center gap-x-2 pr-6">
            <Badge variant="default" className="h-8">
              <p className="text-xs">Admin area</p>
            </Badge>
            <InvitationCreateButton organizationId={organizationId} />
          </div>
          </div>
        }
        tabs={<OrganizationBreadcrumbs organizationName={organizationName} />}
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
