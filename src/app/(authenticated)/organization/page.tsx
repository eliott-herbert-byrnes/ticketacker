import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { organizationCreatePath } from "@/app/paths";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { OrganizationList } from "@/features/organization/components/organization-list";

const OrganizationPage = async () => {

  await getAuthOrRedirect({checkOrganization: true})

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Organizations"
        description="All your organizations"
        actions={
          <Button variant="outline" asChild>
            <Link href={organizationCreatePath()}>
              <LucidePlus className="h-4 w-4" />
              Create organization
            </Link>
          </Button>
        }
      ></Heading>

      <Suspense fallback={<Spinner />}>
        <OrganizationList />
      </Suspense>
    </div>
  );
};

export default OrganizationPage;
