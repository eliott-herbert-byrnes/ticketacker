'use server'

import { prisma } from "@/lib/prisma"

export const getReferencedTickets = async (ticketId: string) => {

    if(!ticketId){
        return [];
    }

    const ticket = await prisma.ticket.findUnique({
        where: {id: ticketId},
        include: {
            referencedTickets: true
        }
    })

    if(!ticket){
        return [];
    }

    return ticket?.referencedTickets ?? [];
}