// import Link from "next/link";
// import { organizationPath } from "@/app/paths";
// import { Badge } from "@/components/ui/badge";
import { getOrganizationsByUser } from "../queries/get-organization-by-user";

export const OrganizationStatus = async () => {
  const organization = await getOrganizationsByUser();

  return (
    <div className="text-sm text-muted-foreground flex flex-col gap-y-2">
        {organization
        .filter((organization) => organization.membershipByUser.isActive)
        .map((organization) => {
            return (
                // <Badge className="h-6" key={organization.id} asChild variant="secondary">
                // <Link href={organizationPath()}>{organization.name}</Link>
                // </Badge>
                <div key={organization.id} className="text-xs">{organization.name}</div>
            )
        })}
    </div>
  );
};
