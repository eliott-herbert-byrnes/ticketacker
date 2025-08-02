"use client";
import { Ticket, TicketStatus } from "@prisma/client";
import { LucideTrash } from "lucide-react";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { ticketsPath } from "@/app/paths";
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
import { deleteTicket } from "@/features/ticket/actions/delete-ticket";
import { updateTicketStatus } from "@/features/ticket/actions/update-ticket-status";
import { TICKET_ICONS_LABELS } from "./constants";

type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({ ticket, trigger }: TicketMoreMenuProps) => {

  // const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: (
      <DropdownMenuItem className="cursor-pointer">
        <LucideTrash className="h-4 w-4 mr-2 " />
        <span>Delete</span>
      </DropdownMenuItem>
    ),
    // onSuccess: () => {
    //   toast.success("Ticket deleted");
    //   setTimeout(() => router.push(ticketsPath()), 300);
    // }
  });

  const handleUpdateTicketStatus = async (value: string) => {
    const promise = updateTicketStatus(ticket.id, value as TicketStatus);

    toast.promise(promise, {
      loading: "Updating status...",
    });

    const result = await promise;

    if ((result.status = "ERROR")) {
      toast.error(result.message);
    } else if (result.status === "SUCCESS") {
      toast.success(result.message);
    }
  };

  const ticketStatusRadioGroupItems = (
    <DropdownMenuRadioGroup
      value={ticket.status}
      onValueChange={handleUpdateTicketStatus}
    >
      {(Object.keys(TICKET_ICONS_LABELS) as Array<TicketStatus>).map((key) => (
        <DropdownMenuRadioItem className="cursor-pointer" key={key} value={key}>
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
        <DropdownMenuContent side="right" className="w-42 ">
          {ticketStatusRadioGroupItems}
          <DropdownMenuSeparator />
          {deleteButton}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { TicketMoreMenu };
