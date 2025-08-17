import { LucideBan, LucideCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { getMemberships } from "../queries/get-memberships";
import { MembershipDeleteButton } from "./membership-delete-button";
import { MembershipMoreMenu } from "./membership-more-menu";
import { PermissionToggle } from "./permission-toggle";

type MembershipListProps = {
  organizationId: string;
};

const MembershipList = async ({ organizationId }: MembershipListProps) => {
  const memberships = await getMemberships(organizationId);
  const { user } = await getAuthOrRedirect();

  const currentUserId = user?.id;

  return (
    <div className="px-14">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Verified Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Delete Ticket</TableHead>
            <TableHead>Update Ticket</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((membership) => {

            const membershipMoreMenu = (
              <MembershipMoreMenu
                userId={membership.userId}
                organizationId={membership.organizationId}
                membershipRole={membership.membershipRole}
                />
            )
            
            const deleteButton = (
              <MembershipDeleteButton
                organizationId={membership.organizationId}
                userId={membership.userId}
              />
            );

            const buttons = 
            <>
            {deleteButton}
            {membershipMoreMenu}
            </>;

            const username =
              membership.userId === currentUserId ? (
                <span>
                  {membership.user.username}{" "}
                  <span className="text-sm text-muted-foreground">(you)</span>
                </span>
              ) : (
                membership.user.username
              );

            return (
              <TableRow key={membership.userId}>
                <TableCell>{username}</TableCell>
                <TableCell>{membership.user.email}</TableCell>
                <TableCell>
                  {membership.user.emailVerified ? (
                    <LucideCheck />
                  ) : (
                    <LucideBan />
                  )}
                </TableCell>
                <TableCell >
                  {membership.membershipRole}
                </TableCell>
                <TableCell >
                  <PermissionToggle
                    userId={membership.userId}
                    organizationId={membership.organizationId}
                    permissionKey="canDeleteTicket"
                    permissionValue={membership.canDeleteTicket}
                    />
                </TableCell>
                <TableCell >
                  <PermissionToggle
                    userId={membership.userId}
                    organizationId={membership.organizationId}
                    permissionKey="canUpdateTicket"
                    permissionValue={membership.canUpdateTicket}
                    />
                </TableCell>
                <TableCell className="flex justify-end gap-x-2">
                  {buttons}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export { MembershipList };
