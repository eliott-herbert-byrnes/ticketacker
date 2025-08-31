import { TicketStatus } from "@prisma/client";
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
