import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import {prisma} from '@/lib/prisma'
import { getTicketPermissions } from "../permissions/get-ticket-permissions";

export const getTicket = async (id: string) => {

    const {user} = await getAuth()

    const ticket = await prisma.ticket.findUnique({
        where: {
            id, 
        },
        include: {
            user: {
                select: {
                    username: true,
                }
            }
        }
    })

    if(!ticket){
        return null
    }

  const owner = isOwner(user, ticket);
  const basePerms = await getTicketPermissions({
    organizationId: ticket.organizationId,
    userId: user?.id,
  });

  return {
    ...ticket,
    isOwner: owner,
    permission: {                 
      canDeleteTicket: owner || !!basePerms.canDeleteTicket,  
      canUpdateTicket: owner || !!basePerms.canUpdateTicket,  
    },
  };
};