'use client'

import Link from "next/link"
import { ticketData } from "@/data/data"
import { ticketPath } from "../paths"

const TicketsPage = () => {

  return (
    ticketData.map((ticket) => (
      <div key={ticket.id} className="">
        <h2>{ticket.title}</h2>
        <Link href={ticketPath(ticket.id)} className="text-sm underline">View</Link>
      </div>
    ))
  )
}

export default TicketsPage