import { format } from "date-fns";
import { LucideTrash } from "lucide-react";
import { Placeholder } from "@/components/Placeholder";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInvitation } from "../queries/get-invitations";

type InvitationListProps = {
    organizationId: string;
}

const InvitationList = async ({organizationId}: InvitationListProps) => {
    const invitation = await getInvitation(organizationId)

    if(!invitation.length){
        return <Placeholder label="No invitations for this organization"/>
    }

    return (
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
                        <Button variant="destructive" size="icon">
                            <LucideTrash className="h-4 w-4"/>
                        </Button>
                    )

                    const buttons = <>{deleteButton}</>

                    return (
                        <TableRow key={invitation.email}>
                            <TableCell>
                                {invitation.email}
                            </TableCell>
                            <TableCell>
                                {format(invitation.createdAt, "yyyy-MM-dd, HH:mm")}
                            </TableCell>
                            <TableCell>
                                {invitation.invitedByUser ?
                                `${invitation.invitedByUser.username} ${invitation.invitedByUser.email}`
                                : "Deleted User"
                            }
                            </TableCell>
                            <TableCell className="flex justify-end gap-x-2">
                                {buttons}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export {InvitationList}