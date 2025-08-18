import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { Spinner } from "@/components/spinner";
import { InvitationCreateButton } from "@/features/invitation/components/invitation-create-button";
import { InvitationList } from "@/features/invitation/components/invitation-list";
import { OrganizationBreadcrumbs } from "../tabs";

type InvitationPageProps = {
    params: Promise<{
        organizationId: string;
    }>
}

const InvitationsPage = async ({params}: InvitationPageProps) => {
    const {organizationId} = await params;

    return (
        <div className="flex-1 flex flex-col gap-y-8">
            <Heading 
                title="Invitations"
                description="Manage your organizations invitations"
                tabs={<OrganizationBreadcrumbs />}
                actions={<InvitationCreateButton organizationId={organizationId} />}
            />

            <Suspense fallback={<Spinner />}>
                <InvitationList organizationId={organizationId}/>
            </Suspense>
        </div>
    )
}

export default InvitationsPage