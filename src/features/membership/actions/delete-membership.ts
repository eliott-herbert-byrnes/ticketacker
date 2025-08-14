'use server'

import { toActionState } from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { getMemberships } from "../queries/get-memberships";

export const deleteMembership = async ({
    userId,
    organizationId,
}: {
    userId: string;
    organizationId: string
}) => {
    const auth = await getAuthOrRedirect()

    const memberships = await getMemberships(organizationId)

    const isLastMembership = (memberships ?? []).length === 1;

    if (isLastMembership){
        return toActionState(
            "ERROR",
            "The last membership cannot be deleted"
        )
    }

    await prisma.membership.delete({
        where: {
            membershipId: {
                userId,
                organizationId,
            }
        }
    })

    if (userId === auth.user?.id){
        return toActionState("SUCCESS", "Deleting member")
    } else {
        return toActionState("SUCCESS", "Leaving organization")
    }

}