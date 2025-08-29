import { hash } from "@node-rs/argon2";
import { MembershipRole, PrismaClient, Role, TicketStatus } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    username: "admin",
    email: "admin@admin.com",
    role: Role.ADMIN,
    emailVerified: new Date(),
  },
  {
    username: "user",
    email: "eliott.c.h.byrnes@googlemail.com",
    role: Role.USER,
    emailVerified: new Date(),
  },
];

const tickets = [
  {
    title: "Ticket 1",
    content: "First ticket from DB.",
    status: TicketStatus.COMPLETE,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499,
  },
  {
    title: "Ticket 2",
    content: "Second ticket from DB.",
    status: TicketStatus.OPEN,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399,
  },
  {
    title: "Ticket 3",
    content: "Third ticket from DB.",
    status: TicketStatus.IN_PROGRESS,
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
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("geheimnis");

  const dbOrganization = await prisma.organization.create({
    data: {
      name: "Organization 1"
    }
  })

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

  await prisma.membership.createMany({
    data: [{
      userId: dbUsers[0].id,
      organizationId: dbOrganization.id,
      isActive: true,
      membershipRole: MembershipRole.ADMIN,
    }, {
      userId: dbUsers[1].id,
      organizationId: dbOrganization.id,
      isActive: true,
      membershipRole: MembershipRole.MEMBER,
    }]
  })

  const dbTickets = [];
  for (const ticket of tickets) {
    const createdTicket = await prisma.ticket.create({
      data: {
        ...ticket,
        userId: dbUsers[0].id,
        organizationId: dbOrganization.id,
      },
    });
    dbTickets.push(createdTicket);
  }

  for (const comment of comments) {
    await prisma.comment.create({
      data: {
        ...comment,
        ticketId: dbTickets[0].id,
        userId: dbUsers[1].id, 
      },
    });
  }

  const t1 = performance.now();
  console.log(`DB Seed: Finished (${(t1 - t0).toFixed(2)}ms)`);
  console.log("Users:", dbUsers.map(u => ({ id: u.id, username: u.username })));
  console.log("Tickets:", dbTickets.map(t => ({ id: t.id, title: t.title })));
};

seed();
