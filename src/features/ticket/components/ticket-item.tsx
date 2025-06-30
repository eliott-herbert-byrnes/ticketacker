import Link from "next/link";
import { ticketPath } from "@/app/paths";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { TICKET_ICONS } from "./constants";
import { Ticket } from "./types";

type TicketItemProps = {
    ticket: Ticket;
}

const TicketItem = ({ticket}: TicketItemProps) => {
  return (
    <Card className="w-full max-w-[420px]">
      <CardTitle className="flex gap-x-2 px-4">
        <span>{TICKET_ICONS[ticket.status]}</span>
        <span className="runcate">{ticket.title}</span>
      </CardTitle>

      <CardContent className="">
        <span className="line-clamp-3 white-space-break-spaces">
          {ticket.content}
        </span>
      </CardContent>

      <CardFooter>
        <Link href={ticketPath(ticket.id)} className="text-sm underline">
          View
        </Link>
      </CardFooter>
    </Card>
  );
};

export { TicketItem };
