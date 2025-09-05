import { TicketStatus } from "@prisma/client";
import { FieldRef } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";

export const createTicket = (
  dbData: {
    userId: string;
    bounty: number;
    title: string;
    content: string;
    deadline: string;
  },
  organizationId: string
) => {
  return prisma.ticket.create({
    data: {
      ...dbData,
      organizationId,
    },
  });
};

export const findTicket = async (id: string) => {
  return prisma.ticket.findUnique({
    where: { id },
  });
};

export const findUniqueTicket = async (id: string) => {
  return prisma.ticket.findUnique({
    where: { id },
    select: { userId: true },
  });
};

export const updateTicket = async (
  id: string,
  dbData: {
    userId: string;
    bounty: number;
    title: string;
    content: string;
    deadline: string;
  }
) => {
  return prisma.ticket.update({
    where: { id },
    data: dbData,
  });
};

export const updateTicketStatusById = async (
  id: string,
  status: TicketStatus
) => {
  return prisma.ticket.update({
    where: { id },
    data: { status },
  });
};

export const deleteTicket = async (id: string) => {
  return prisma.ticket.delete({ where: { id } });
};

export const updateTicketData = async (
  id: string,
  dbData: {
    userId: string;
    bounty: number;
    title: string;
    content: string;
    deadline: string;
  }
) => {
  return prisma.ticket.update({
    where: { id },
    data: dbData,
  });
};


export const findManyTickets = async (unique: string[] | FieldRef<"Ticket", "String[]"> | undefined) => {
  return await prisma.ticket.findMany({
        where: {id: {in: unique}},
        select: {id: true}
    })
}

export const updateDeletedTickets = async (id: string, connect: { id: string; }[]) => {
  return await prisma.ticket.update({
        where: {id},
        data: {
            referencedTickets: {
                connect,
            }
        }
    })
}

export const findManyComments = async (ticketId: string, not: string) => {
  return await prisma.comment.findMany({
    where: {
      ticketId,
      id: {
        not,
      },
    },
  });
}

export const findTicketIdTitle = async (ids: string[]) => {
  return await prisma.ticket.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true },
  });
}

export const findMinimalUniqueTicket = async (id: string) => {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
}

export const findUniqueTicketUser = async (id: string) => {
  return await prisma.ticket.findUnique({
        where: {
            id, 
        },
        include: {
            user: {
                select: {
                    username: true,
                }
            }
        }
    })
}