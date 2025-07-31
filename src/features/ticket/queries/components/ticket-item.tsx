'use client'

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
import { Separator } from "@/components/ui/separator";
import { toCurrencyFromCent } from "@/utils/currency";
import { TicketWithMetadata } from "../../types";
import { TICKET_ICONS } from "./constants";
import { TicketMoreMenu } from "./ticket-more-menu";

type TicketItemProps = {
  ticket: TicketWithMetadata;
  isDetail?: boolean;
  comments?: React.ReactNode;
};

const TicketItem = ({ ticket, isDetail, comments }: TicketItemProps) => {
 
  const buttonElement = (
    <Button variant="outline" asChild size="icon">
      <Link prefetch href={ticketPath(ticket.id)}>
        <LucideArrowUpRight />
      </Link>
    </Button>
  );

  const editButton = ticket.isOwner ? (
    <Button variant="outline" asChild size="icon">
      <Link prefetch href={editPath(ticket.id)}>
        <LucidePencil className="h-4 w-4" />
      </Link>
    </Button>
  ) : null;

  const moreMenu = ticket.isOwner ? (
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
    <div className={clsx("w-full flex-col flex gap-y-4", {
          "max-w-[580px]": isDetail,
          "max-w-[420px]": !isDetail,
        })}>
      <div
        className="w-full flex gap-x-2"
      >
        <Card className="w-full">
          <CardTitle className="flex gap-x-2 px-4 items-center">
            <span>{TICKET_ICONS[ticket.status]}</span>
            <span className="truncate">{ticket.title}</span>
          </CardTitle>

          <CardContent className="">
            <span className="line-clamp-3 white-space-break-spaces">
              {ticket.content}
            </span>
          </CardContent>
          <CardFooter className="flex justify-between items-end">
            <p className="text-sm text-muted-foreground ">
              {ticket.deadline} by {ticket.user.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {toCurrencyFromCent(ticket.bounty / 100)}
            </p>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-y-2">
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

      <Separator />

      {comments}
    </div>
  );
};

export { TicketItem };
