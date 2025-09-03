import * as ticketData from "../data"

export const connectReferencedTickets = async (
    ticketId: string,
    ticketIds: string[]
) => {
    if(!ticketId || !Array.isArray(ticketIds) || ticketIds.length === 0){
        return;
    }

    const unique = Array.from(new Set(ticketIds)).filter((id) => id && id !== ticketId)
    if(unique.length === 0) return;

    const existing = await ticketData.findManyTickets(unique)

    const existingIds = existing.map((t) => t.id)
    if (existingIds.length === 0) return;

    const mappedIds = existingIds.map((id) => ({id}))

    await ticketData.updateDeletedTickets(ticketId, mappedIds)
}
