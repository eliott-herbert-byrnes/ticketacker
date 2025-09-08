"use client";
import { TicketStatus } from "@prisma/client";
import { LucideLock, LucideTrash, LucideUnlock } from "lucide-react";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteTicket } from "@/features/ticket/actions/delete-ticket";
import { updateTicketPrivacy } from "@/features/ticket/actions/update-ticket-privacy";
import { updateTicketStatus } from "@/features/ticket/actions/update-ticket-status";
import { TicketWithMetadata } from "../types";
import { TICKET_ICONS_LABELS } from "./constants";

type TicketMoreMenuProps = {
  ticket: TicketWithMetadata; 
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({ ticket, trigger }: TicketMoreMenuProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: (
      <DropdownMenuItem
        className="cursor-pointer"
        disabled={!ticket.permission?.canDeleteTicket}
      >
        <LucideTrash className="h-4 w-4 mr-2" />
        <span>Delete</span>
      </DropdownMenuItem>
    ),
  });

  const handleUpdateTicketStatus = async (value: string) => {
    const promise = updateTicketStatus(ticket.id, value as TicketStatus);
    toast.promise(promise, { loading: "Updating status..." });
    const result = await promise;
    if (result.status === "ERROR") toast.error(result.message);
    else toast.success(result.message);
  };

  const canUpdate = !!ticket.permission?.canUpdateTicket;
  const canMakePrivate = !!ticket.features?.canMakePrivateTickets;

  const handleTogglePrivacy = async () => {
    const wantPrivate = !ticket.private;
    const promise = updateTicketPrivacy(ticket.id, wantPrivate);
    toast.promise(promise, {
      loading: wantPrivate ? "Making private..." : "Making public...",
    });
    const result = await promise;
    if (result.status === "ERROR") toast.error(result.message);
    else toast.success(result.message);
  };

  const wouldMakePrivate = !ticket.private;
  const disableForSubscription = wouldMakePrivate && !canMakePrivate;
  const privacyItemCore = (
    <DropdownMenuItem
      className="cursor-pointer"
      disabled={!canUpdate || disableForSubscription}
      onSelect={(e) => {
        e.preventDefault();
        if (!canUpdate || disableForSubscription) return;
        void handleTogglePrivacy();
      }}
    >
      {ticket.private ? (
        <LucideUnlock className="h-4 w-4 mr-2" />
      ) : (
        <LucideLock className="h-4 w-4 mr-2" />
      )}
      <span>{ticket.private ? "Make public" : "Make private"}</span>
    </DropdownMenuItem>
  );

  const privacyItem = disableForSubscription ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{privacyItemCore}</div>
      </TooltipTrigger>
      <TooltipContent>
        <p>You need to subscribe to activate this feature</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    privacyItemCore
  );

  const ticketStatusRadioGroupItems = (
    <DropdownMenuRadioGroup value={ticket.status} onValueChange={handleUpdateTicketStatus}>
      {(Object.keys(TICKET_ICONS_LABELS) as Array<TicketStatus>).map((key) => (
        <DropdownMenuRadioItem
          className="cursor-pointer"
          key={key}
          value={key}
          disabled={!canUpdate}
        >
          {TICKET_ICONS_LABELS[key]}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  return (
    <>
      {deleteDialog}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-42">
          {!canUpdate ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{ticketStatusRadioGroupItems}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You do not have permission to update tickets</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            ticketStatusRadioGroupItems
          )}

          <DropdownMenuSeparator />

          {privacyItem}

          <DropdownMenuSeparator />

          {!ticket.permission?.canDeleteTicket ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{deleteButton}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You do not have permission to delete tickets</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            deleteButton
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { TicketMoreMenu };
