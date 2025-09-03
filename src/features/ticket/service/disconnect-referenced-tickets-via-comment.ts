import { Comment } from "@prisma/client";
import { findTicketIdsFromText } from "@/utils/find-ids-from-text";
import * as ticketData from "../data";

export const disconnectReferencedTicketsViaComment = async (
  comment: Comment
) => {
  const ticketIds = findTicketIdsFromText("tickets", comment.content);

  if (!ticketIds.length) return;

  const comments = await ticketData.findManyComments(
    comment.ticketId,
    comment.id
  );

  const allOtherTicketIds = findTicketIdsFromText(
    "tickets",
    comments.map((comment) => comment.content).join(" ")
  );

  const ticketIdsToRemove = ticketIds.filter(
    (ticketId) => !allOtherTicketIds.includes(ticketId)
  );

  await ticketData.disconnectReferencedTickets(
    comment.ticketId,
    ticketIdsToRemove
  );
};
