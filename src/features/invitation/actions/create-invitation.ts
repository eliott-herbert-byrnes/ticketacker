'use server'
import { revalidatePath } from "next/cache"
import {z} from "zod"
import { invitationsPath } from "@/app/paths"
import { ActionState, fromErrorToActionState, toActionState } from "@/components/form/utils/to-action-state"
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect"
import { prisma } from "@/lib/prisma"

const createInvitiationSchema = z.object({
    email: z.string().min(1, {message: "Is required"}).max(191).email(),
})

export const createInvitiation = async (
    organizationId: string,
    _actionState: ActionState,
    formData: FormData
) => {
    await getAdminOrRedirect(organizationId)

    try {
        const {email} = createInvitiationSchema.parse({
            email: formData.get("email")
        })

        //TODO invite by email link to join organization

        const targetMembership = await prisma.membership.findFirst({
            where: {
                organizationId,
                user: {
                    email,
                }
            }
        })

        if(targetMembership){
            return toActionState("ERROR", "User is already a member of this organization")
        }

    } catch(error){
        return fromErrorToActionState(error)
    }

    revalidatePath(invitationsPath(organizationId))
    return toActionState("SUCCESS", "User invited to organization")
}