import Link from "next/link"
import { ticketsPath } from "./paths"

const Homepage = () => {
  return (
    <div>
      <h2 className="">Homepage</h2>
      <Link href={ticketsPath()} className="text-sm underline">Tickets</Link>
      </div>
  )
}

export default Homepage