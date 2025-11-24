import { LucideBan, LucideCheck } from "lucide-react";
import { CardCompact } from "@/components/card-compact";
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
    <>
      {/* Mobile: cards */}
      <div className="md:hidden px-4 space-y-3">
        {memberships.map((membership) => {
          const username =
            membership.userId === currentUserId ? (
              <span>
                {membership.user.username} <span className="text-sm text-muted-foreground">(you)</span>
              </span>
            ) : (
              membership.user.username
            );

          const footer = (
            <div className="flex justify-end gap-2 w-full">
              <MembershipDeleteButton organizationId={membership.organizationId} userId={membership.userId} />
              <MembershipMoreMenu
                userId={membership.userId}
                organizationId={membership.organizationId}
                membershipRole={membership.membershipRole}
              />
            </div>
          );

          return (
            <CardCompact
              key={membership.userId}
              title={typeof username === "string" ? username : ""}
              description={membership.user.email}
              content={
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Verified Email</span>
                    <span>{membership.user.emailVerified ? <LucideCheck /> : <LucideBan />}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span>{membership.membershipRole}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delete Ticket</span>
                    <PermissionToggle
                      userId={membership.userId}
                      organizationId={membership.organizationId}
                      permissionKey="canDeleteTicket"
                      permissionValue={membership.canDeleteTicket}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Update Ticket</span>
                    <PermissionToggle
                      userId={membership.userId}
                      organizationId={membership.organizationId}
                      permissionKey="canUpdateTicket"
                      permissionValue={membership.canUpdateTicket}
                    />
                  </div>
                </div>
              }
              footer={footer}
              className="w-full"
            />
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="px-14 hidden md:block">
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
              );

              const deleteButton = (
                <MembershipDeleteButton
                  organizationId={membership.organizationId}
                  userId={membership.userId}
                />
              );

              const buttons = (
                <>
                  {deleteButton}
                  {membershipMoreMenu}
                </>
              );

              const username =
                membership.userId === currentUserId ? (
                  <span>
                    {membership.user.username} {" "}
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
                  <TableCell>{membership.membershipRole}</TableCell>
                  <TableCell>
                    <PermissionToggle
                      userId={membership.userId}
                      organizationId={membership.organizationId}
                      permissionKey="canDeleteTicket"
                      permissionValue={membership.canDeleteTicket}
                    />
                  </TableCell>
                  <TableCell>
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
    </>
  );
};

export { MembershipList };
