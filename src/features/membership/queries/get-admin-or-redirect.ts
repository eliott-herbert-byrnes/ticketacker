import { redirect } from "next/navigation";
import { signInPath } from "@/app/paths";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect"
import { getMembership } from "./get-membership";

export const getAdminOrRedirect = async (organizationId: string) => {
    // standard auth check
    const auth = await getAuthOrRedirect();

    // membership of auth user
    const membership = await getMembership({
        organizationId,
        userId: auth.user!.id,
    })

    // authorisation checks
    if(!membership){
        redirect(signInPath())
    }

    if(membership.membershipRole !== "ADMIN"){
        redirect(signInPath())
    }

    return {...auth, membership}
}