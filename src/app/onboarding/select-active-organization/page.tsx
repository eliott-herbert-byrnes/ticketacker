import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { onboardingPath, organizationPath,  } from "@/app/paths";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { OrganizationList } from "@/features/organization/components/organization-list";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";

const SelectActiveOrganizationPage = async () => {

 const organizations = await getOrganizationsByUser()

 const hasActive = organizations.some((organization) => {
    return organization.membershipByUser.isActive;
 })

 if(hasActive){
    redirect(organizationPath())
 }

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Select Organization"
        description="Pick one organization to work with"
        actions={
          <Button variant="outline" asChild>
            <Link href={onboardingPath()}>
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

export default SelectActiveOrganizationPage;
