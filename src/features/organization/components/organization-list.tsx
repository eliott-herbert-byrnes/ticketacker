import { format } from "date-fns";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucidePen,
} from "lucide-react";
import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrganizationsByUser } from "../queries/get-organization-by-user";
import { OrganizationDeleteButton } from "./organization-delete-button";
import { OrganizationSwitchButton } from "./organization-switch-button";

type OrganizationListProps = {
  limitedAccess: boolean;
}

export const OrganizationList = async ({limitedAccess}: OrganizationListProps) => {
  const organizations = await getOrganizationsByUser();
  const hasActive = organizations.some(
    (organization) => organization.membershipByUser.isActive
  );

  return (
    <div className="overflow-hidden">
    <Table className="table-fixed w-full [&_th]:px-14 [&_td]:px-14 [&_th]:py-4 [&_td]:py-4">
      <TableHeader>
        <TableRow>
          {/* <TableHead className="px-8 w-[300px]">ID</TableHead> */}
          <TableHead className="w-[150px] text-left">ID</TableHead>
          <TableHead className="w-[150px] text-left">Name</TableHead>
          <TableHead className="w-[150px] text-left">Joined At</TableHead>
          <TableHead className="w-[50px] text-left">Members</TableHead>
          <TableHead className="w-[150px] text-left">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* <TableBody className="[&_tr:nth-child(even)]:bg-muted/40"> */}
        {organizations.map((organization) => {
          const isActive = organization.membershipByUser.isActive;

          const switchButton = (
            <OrganizationSwitchButton
            organizationId={organization.id}
            trigger={
              <SubmitButton
                  variant={
                    !hasActive ? "secondary" : isActive ? "default" : "outline"
                  }
                  label={!hasActive ? "Active" : isActive ? "Active" : "Switch"}
                  icon={<LucideArrowLeftRight className="w-4 h-4" />}
                  ></SubmitButton>
                }
                />
              );
              
          const detailButton = (
            <Button variant="outline" className="cursor-pointer">
              <LucideArrowUpRightFromSquare className="w-4 h-4" />
            </Button>
          );
          
          const editButton = (
            <Button variant="outline" className="cursor-pointer">
              <LucidePen className="w-4 h-4" />
            </Button>
          );

          const deleteButton = (
            <>
              <OrganizationDeleteButton organizationId={organization.id} />
            </>
          );
          
          const buttons = (
            <div className="flex gap-2">
              {switchButton}
              {limitedAccess ? null : detailButton}
              {limitedAccess ? null : editButton}
              {limitedAccess ? null : deleteButton}
            </div>
          );
          
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
              <TableCell>{buttons}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
          </div>
  );
};
