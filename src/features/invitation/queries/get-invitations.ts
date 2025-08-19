import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect"
import { prisma } from "@/lib/prisma"

export const getInvitation = async (organizationId: string) => {
    // ADMIN auth check or redirect
    await getAdminOrRedirect(organizationId)

    // Query all invitations for the organizationId
    // for each invite return obj:
    // invitee's email
    // creation timestamp
    // inviter's email and username
    return await prisma.invitation.findMany({
        where: {
            organizationId,
        },
        select: {
            email: true,
            createdAt: true,
            organizationId: true,
            invitedByUser: {
                select: {
                    email: true,
                    username: true,
                }
            }
        }
    })
}