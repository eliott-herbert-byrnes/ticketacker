import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { CredentialCreateButton } from "@/features/credentials/components/credential-create-button";
import { CredentialList } from "@/features/credentials/components/credential-list";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type CredentialsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const CredentialsPage = async ({ params }: CredentialsPageProps) => {
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
        title="Credentials"
        description="Manage your organization's API secrets"
        tabs={breadcrumbs}
        actions={<CredentialCreateButton organizationId={organizationId} />}
      />
      <div className="flex items-center justify-center px-14">
        <Suspense>
          <CredentialList organizationId={organizationId} />
        </Suspense>
      </div>
    </div>
  );
};

export default CredentialsPage;
