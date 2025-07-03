'use client'
import { Ticket } from "@prisma/client";
import clsx from "clsx";
import { LucideArrowUpRight, LucideTrash } from "lucide-react";
import Link from "next/link";
import { ticketPath } from "@/app/paths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { deleteTicket } from "@/features/actions/delete-ticket";
import { TICKET_ICONS } from "./constants";

type TicketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
  const buttonElement = (
    <Button variant="outline" asChild size="icon">
      <Link href={ticketPath(ticket.id)}>
        <LucideArrowUpRight />
      </Link>
    </Button>
  );

  const deleteButton = (
    <form action={deleteTicket.bind(null, ticket.id)}>
      <Button variant='outline' size='icon' className="cursor-pointer">
        <LucideTrash className='h-4 w-4' />
      </Button>
    </form>
  )

  return (
    <div className={clsx("w-full flex gap-x-1", {
      "max-w-[580px]": isDetail,
      "max-w-[420px]": !isDetail,
    }
    )}>
      <Card className="w-full ">
        <CardTitle className="flex gap-x-2 px-4">
          <span>{TICKET_ICONS[ticket.status]}</span>
          <span className="truncate">{ticket.title}</span>
        </CardTitle>

        <CardContent className="">
          <span className="line-clamp-3 white-space-break-spaces">
            {ticket.content}
          </span>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-y-1 justify-between">
        {isDetail ? deleteButton : buttonElement}
        </div>
    </div>
  );
};

export { TicketItem };
