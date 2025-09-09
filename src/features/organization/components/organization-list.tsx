import { format } from "date-fns";
import { CardCompact } from "@/components/card-compact";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrganizationsByUser } from "../queries/get-organization-by-user";
import { OrganizationRowActions } from "./organization-row-actions";

export const OrganizationList = async () => {
  const organizations = await getOrganizationsByUser();
  const hasActive = organizations.some(
    (organization) => organization.membershipByUser.isActive
  );

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="md:hidden px-4 space-y-3">
        {organizations.map((organization) => {
          const isActive = organization.membershipByUser.isActive;
          const isAdmin =
            organization.membershipByUser.membershipRole === "ADMIN";

          return (
            <CardCompact
              key={organization.id}
              title={organization.name}
              description={`ID: ${organization.id}`}
              content={
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Joined At</span>
                    <span>
                      {format(
                        organization.membershipByUser.joinedAt,
                        "yyyy-MM-dd, HH:mm"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Members</span>
                    <span>{organization._count.memberships}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Admin</span>
                    <span>{organization.membershipByUser.membershipRole}</span>
                  </div>
                </div>
              }
              footer={
                <div className="pl-55">
                <OrganizationRowActions
                  organizationId={organization.id}
                  organizationName={organization.name}
                  membershipUserId={organization.membershipByUser.userId}
                  isAdmin={isAdmin}
                  hasActive={hasActive}
                  isActive={isActive}
                  />
                </div>
              }
              className="w-full"
            />
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-hidden px-14">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((organization) => {
              const isActive = organization.membershipByUser.isActive;
              const isAdmin =
                organization.membershipByUser.membershipRole === "ADMIN";

              return (
                <TableRow key={organization.id}>
                  <TableCell>{organization.id}</TableCell>
                  <TableCell>{organization.name}</TableCell>
                  <TableCell>
                    {format(
                      organization.membershipByUser.joinedAt,
                      "yyyy-MM-dd, HH:mm"
                    )}
                  </TableCell>
                  <TableCell>{organization._count.memberships}</TableCell>
                  <TableCell>
                    {organization.membershipByUser.membershipRole}
                  </TableCell>
                  <TableCell>
                    <OrganizationRowActions
                      organizationId={organization.id}
                      organizationName={organization.name}
                      membershipUserId={organization.membershipByUser.userId}
                      isAdmin={isAdmin}
                      hasActive={hasActive}
                      isActive={isActive}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
