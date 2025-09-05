import { authenticateCredential } from "@/features/credentials/service/authenticate-credentials";
import * as ticketData from "@/features/ticket/data";

export class NotFoundError extends Error {}

export const deleteByCredential = async (args: {
  ticketId: string;
  token: string;
}) => {
  const { ticketId, token } = args;

  const ticket = await ticketData.findMinimalUniqueTicket(ticketId);

  if (!ticket) throw new NotFoundError("Ticket not found");

  const credential = await authenticateCredential({
    token,
    organizationId: ticket.organizationId,
    requiredScopes: "delete:ticket",
  });

  await ticketData.deleteTicket(ticketId);

  return { ticketId: ticket.id, credentialId: credential.id };
};
