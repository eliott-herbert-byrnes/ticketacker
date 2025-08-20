import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { Badge } from "@/components/ui/badge";
import { InvitationCreateButton } from "@/features/invitation/components/invitation-create-button";
import { InvitationList } from "@/features/invitation/components/invitation-list";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type InvitationPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};
const InvitationsPage = async ({ params }: InvitationPageProps) => {
  const { organizationId } = await params;

  const organization = await getOrganizationsByUser();

  const organizationName =
    organization.find((o) => o.id === organizationId)?.name ?? "Organization";

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Invitations"
        description="Manage your organizations invitations"
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
        tabs={
          <div className="pl-14">
            <OrganizationBreadcrumbs organizationName={organizationName} />
          </div>
        }
      />

      <Suspense fallback={<Spinner />}>
        <InvitationList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default InvitationsPage;
