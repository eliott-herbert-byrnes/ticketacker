import { hash } from "@node-rs/argon2"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const users = [
    {
        username: "admin",
        email: "admin@admin.com"
    },
    {
        username: "user",
        email: "eliott.c.h.byrnes@gmail.com"
    }
]

const tickets = [
    {
        title: `Ticket 1`,
        content: 'This is the mock information for a ticket 1 from the database',
        status: 'OPEN' as const,
        deadline: new Date().toISOString().split("T")[0],
        bounty: 499,
    },
    {
        title: `Ticket 2`,
        content: 'This is the mock information for a ticket 2 from the database',
        status: 'DONE' as const,
        deadline: new Date().toISOString().split('T')[0],
        bounty: 499,
    },
    {
        title: `Ticket 3`,
        content: 'This is the mock information for a ticket 2 from the database',
        status: 'IN_PROGRESS' as const,
        deadline: new Date().toISOString().split('T')[0],
        bounty: 499,
    }
]

const seed = async () => {
    const t0 = performance.now()
    console.log('DB Seed: Started...')

    await prisma.user.deleteMany()
    await prisma.ticket.deleteMany()

    const passwordHash = await hash("geheimnis")

   const dbUsers =  await prisma.user.createManyAndReturn({
        data: users.map((user) => ({
            ...user,
            passwordHash,
        }))
    })

    await prisma.ticket.createMany({
        data: tickets.map((ticket) => ({
            ...ticket,
            userId: dbUsers[0].id,
        }))
    })

    const t1 = performance.now()
    console.log(`DB Seed: Finished (${t0 - t1}ms)`)
}

seed()