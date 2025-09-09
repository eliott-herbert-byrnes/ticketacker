import { format } from "date-fns";
import { CardCompact } from "@/components/card-compact";
import { Placeholder } from "@/components/Placeholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInvitation } from "../queries/get-invitations";
import { InvitationDeleteButton } from "./invitation-delete-button";

type InvitationListProps = {
  organizationId: string;
};

const InvitationList = async ({ organizationId }: InvitationListProps) => {
  const invitation = await getInvitation(organizationId);

  if (!invitation.length) {
    return <Placeholder label="No invitations for this organization" />;
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="md:hidden px-4 space-y-3">
        {invitation.map((inv) => (
          <CardCompact
            key={inv.email}
            title={inv.email}
            description={`Invited by: ${inv.invitedByUser ? `${inv.invitedByUser.username} ${inv.invitedByUser.email}` : "Deleted User"}`}
            content={
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Invited At</span>
                  <span>{format(inv.createdAt, "yyyy-MM-dd, HH:mm")}</span>
                </div>
              </div>
            }
            footer={
              <div className="flex justify-end w-full">
                <InvitationDeleteButton email={inv.email} organizationId={inv.organizationId} />
              </div>
            }
            className="w-full"
          />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="px-14 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Invited At</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitation.map((invitation) => {
              const deleteButton = (
                <InvitationDeleteButton
                  email={invitation.email}
                  organizationId={invitation.organizationId}
                />
              );

              const buttons = <>{deleteButton}</>;

              return (
                <TableRow key={invitation.email}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>
                    {format(invitation.createdAt, "yyyy-MM-dd, HH:mm")}
                  </TableCell>
                  <TableCell>
                    {invitation.invitedByUser
                      ? `${invitation.invitedByUser.username} ${invitation.invitedByUser.email}`
                      : "Deleted User"}
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

export { InvitationList };
