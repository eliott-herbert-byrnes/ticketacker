import { Prisma } from "@prisma/client";
import clsx from "clsx";
import {
  LucideArrowUpRight,
  LucideMoreVertical,
  LucidePencil,
} from "lucide-react";
import Link from "next/link";
import { editPath, ticketPath } from "@/app/paths";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { toCurrencyFromCent } from "@/utils/currency";
import { TICKET_ICONS } from "./constants";
import { TicketMoreMenu } from "./ticket-more-menu";

type TicketItemProps = {
  ticket: Prisma.TicketGetPayload<{
    include: {user: {
      select: {
        username: true,
      }
    }},
  }>;
  isDetail?: boolean;
};

const TicketItem = async ({ ticket, isDetail }: TicketItemProps) => {

  const { user } = await getAuth()
  const isTicketOwner = isOwner(user, ticket)

  const buttonElement = (
    <Button variant="outline" asChild size="icon">
      <Link prefetch href={ticketPath(ticket.id)}>
        <LucideArrowUpRight />
      </Link>
    </Button>
  );

  const editButton = isTicketOwner ? (
    <Button variant="outline" asChild size="icon">
      <Link prefetch href={editPath(ticket.id)}>
        <LucidePencil className="h-4 w-4" />
      </Link>
    </Button>
  ) : null;

  const moreMenu = isTicketOwner ? (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button variant="outline" size="icon" className="cursor-pointer">
          <LucideMoreVertical className="h-4 w-4" />
        </Button>
      }
    />
  ) : null;

  return (
    <div
      className={clsx("w-full flex gap-x-1", {
        "max-w-[580px]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
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
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {ticket.deadline} by {ticket.user.username}
            </p>
          <p className="text-sm text-muted-foreground">
            {toCurrencyFromCent(ticket.bounty / 100)}
          </p>
        </CardFooter>
      </Card>

      <div className="flex flex-col gap-y-1">
        {isDetail ? (
          <>
            {editButton}
            {moreMenu}
          </>
        ) : (
          <>
            {buttonElement}
            {editButton}
          </>
        )}
      </div>
    </div>
  );
};

export { TicketItem };
