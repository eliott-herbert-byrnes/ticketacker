import { prisma } from "@/lib/prisma"

export const createCredential = async (secretHash: string, organizationId: string, name: string) => {
    return await prisma.credential.create({
            data: {
                secretHash,
                organizationId,
                name,
            }
        })
}