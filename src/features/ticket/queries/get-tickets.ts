import { ticketData } from "@/data/data"
import { Ticket } from "./components/types"

export const getTickets = async (): Promise<Ticket[]> => {
await new Promise((resolve) => setTimeout(resolve, 2000))

    return new Promise((resolve) => {
        resolve(ticketData)
    })
}