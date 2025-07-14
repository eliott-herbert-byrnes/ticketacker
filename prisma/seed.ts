import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const ticketData = [
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
    await prisma.ticket.deleteMany()

    await prisma.ticket.createMany({
        data: ticketData,
    })

    const t1 = performance.now()
    console.log(`DB Seed: Finished (${t0 - t1}ms)`)
}

seed()