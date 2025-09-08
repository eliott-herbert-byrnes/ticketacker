import { Prisma } from "@prisma/client";

export type OrgStripeFeatures = {
  canMakePrivateTickets: boolean;
};

export type TicketWithMetadata = Prisma.TicketGetPayload<{
  include: {
    user: { select: { username: true } };
    organization: { select: { id: true; name: true } }; 
  };
}> & {
  isOwner: boolean;
  permission: { canDeleteTicket: boolean; canUpdateTicket: boolean };
  features?: OrgStripeFeatures; 
};
