import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { MembershipList } from "@/features/membership/components/membership-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type MembershipsPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const MembershipsPage = async ({ params }: MembershipsPageProps) => {
  const { organizationId } = await params;

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Memberships"
        description="Manage members in your organization"
        actions={
        //   <Button variant="outline" disabled>
        //       Admin area
        //   </Button>
        <div className="pr-6">
        <Badge variant="default" className="h-8">
            Admin area
        </Badge>
        </div>
        }
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipsPage;
