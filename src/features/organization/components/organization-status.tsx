import { getOrganizationsByUser } from "../queries/get-organization-by-user";

export const OrganizationStatus = async () => {
  const organization = await getOrganizationsByUser();

  return (
    <div className="text-sm text-muted-foreground flex flex-col gap-y-2">
        {organization
        .filter((organization) => organization.membershipByUser.isActive)
        .map((organization) => {
            return (
                <div key={organization.id} className="text-xs">{organization.name}</div>
            )
        })}
    </div>
  );
};
