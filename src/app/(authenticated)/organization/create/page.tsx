import { CardCompact } from "@/components/card-compact"
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect"
import { OrganizationCreateForm } from "@/features/organization/components/organization-create-form"

const OrganizationCreate = async () => {
    await getAuthOrRedirect({
        checkOrganization: false,
        checkActiveOrganization: false,
    })
    return (
        <div className="flex-1 flex flex-col items-center">
            <CardCompact 
                title="Create Organization"
                description="Create an organization to get started"
                className="w-full max-w-[420px] animate-fade-from-top"
                content={<OrganizationCreateForm />}
            />
        </div>
    )
}

export default OrganizationCreate