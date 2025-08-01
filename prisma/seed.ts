import { hash } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    username: "admin",
    email: "admin@admin.com",
  },
  {
    username: "user",
    email: "hello@road-to-next.com",
  },
];

const tickets = [
  {
    title: "Ticket 1",
    content: "First ticket from DB.",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
  },
  {
    title: "Ticket 2",
    content: "Second ticket from DB.",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
  {
    title: "Ticket 3",
    content: "Third ticket from DB.",
    status: "IN_PROGRESS" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 599,
  },
];

const comments = [
  { content: "First comment from DB." },
  { content: "Second comment from DB." },
  { content: "Third comment from DB." },
];

const seed = async () => {
  const t0 = performance.now();
  console.log("DB Seed: Started ...");

  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("geheimnis");

  // Create users and capture their IDs
  const dbUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        passwordHash,
      },
    });
    dbUsers.push(createdUser);
  }

  // Create tickets for admin user
  const dbTickets = [];
  for (const ticket of tickets) {
    const createdTicket = await prisma.ticket.create({
      data: {
        ...ticket,
        userId: dbUsers[0].id, // admin
      },
    });
    dbTickets.push(createdTicket);
  }

  // Create comments for user on the first ticket
  for (const comment of comments) {
    await prisma.comment.create({
      data: {
        ...comment,
        ticketId: dbTickets[0].id,
        userId: dbUsers[1].id, // user
      },
    });
  }

  const t1 = performance.now();
  console.log(`DB Seed: Finished (${(t1 - t0).toFixed(2)}ms)`);
  console.log("Users:", dbUsers.map(u => ({ id: u.id, username: u.username })));
  console.log("Tickets:", dbTickets.map(t => ({ id: t.id, title: t.title })));
};

seed();
