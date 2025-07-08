'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ticketsPath } from "@/app/paths";
import { prisma } from "@/lib/prisma";

const UpsertTicket = async (id: string | undefined, formData: FormData) => {
    
    const data = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
    }

    // const ticket = await prisma.ticket.findFirst({
    // where: { title: data.title, content: data.content },
    // orderBy: { createdAt: "desc" }
    // })
    
    await prisma.ticket.upsert({
        where: {
            id: id || "",
        },
        update: data,
        create: data,
    })
    

    revalidatePath(ticketsPath())
    redirect(ticketsPath())
    // if (ticket?.id) {
    // redirect(ticketPath(ticket.id))
    // }
}

export { UpsertTicket };