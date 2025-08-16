"use server";

import { organizationCreatePath } from "@/app/paths";
import { fromErrorToActionState } from "@/components/form/utils/to-action-state";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
// import { getOrganizationsByUser } from "../queries/get-organization-by-user";

export const deleteOrganization = async (organizationId: string) => {
  const {user} = await getAdminOrRedirect(organizationId);

  try {

    // delete org, find remaining, if remaining pick one and mark as active

    await prisma.$transaction(async (tx) => {

      await tx.organization.delete({where: {id: organizationId}});

      const remainingMemberships = await tx.membership.findMany({
        where: {userId: user!.id},
        select: {organizationId: true},
        orderBy: {joinedAt: "asc"}
      })

      if(remainingMemberships.length > 0){
        const nextOrgId = remainingMemberships[0].organizationId
        await tx.membership.updateMany({
          where: {userId: user!.id},
          data: {isActive: false}
        })
        await tx.membership.update({
          where: {
            membershipId: {organizationId: nextOrgId, userId: user!.id}
          },
          data: {isActive: true}
        })
      }
    })

    // check for remaining orgs, if none redirect to create
    const remaining = await prisma.membership.count({where: {userId: user!.id}})
    
    if(remaining === 0){
      return {
        ...toActionState("SUCCESS", "Organization deleted"),
        data: {redirectTo: organizationCreatePath()}
      }
    }
    
    return toActionState("SUCCESS", "Active organization has been switched");
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
