import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { Badge } from "@/components/ui/badge";
import { MembershipList } from "@/features/membership/components/membership-list";

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
