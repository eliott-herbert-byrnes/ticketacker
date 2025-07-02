import { ticketData } from "@/data/data"
import { Ticket } from "./components/types"

export const getTicket = async (ticketId: string): Promise<Ticket | null> => {

await new Promise((resolve) => setTimeout(resolve, 2000))

const ticket =  ticketData.find((ticket) => ticket.id === ticketId)

return new Promise((resolve) => {
    resolve(ticket || null)
})
}