import Link from "next/link";
import { pricingPath } from "@/app/paths";
import { Heading } from "@/components/Heading";
import { Placeholder } from "@/components/Placeholder";
import { Button } from "@/components/ui/button";
import { OrganizationBreadcrumbs } from "../_navigation/tabs";

type SubscriptionPageProps = {
    params: Promise<{
        organizationId: string;
    }>
}

const SubscriptionPage = async ({params}: SubscriptionPageProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {organizationId} = await params;

    return (
        <div className="flex-1 flex flex-col gap-y-8">
            <Heading 
                title="Subscription"
                description="Manage your subscriptions"
                tabs={<OrganizationBreadcrumbs />}
            />

            <Placeholder 
                label="No subsciption for this organization"
                button={
                    <Button asChild variant="outline">
                        <Link href={pricingPath()}>
                        Go to Pricing
                        </Link>
                    </Button>
                }
            />
        </div>
    )
}

export default SubscriptionPage;