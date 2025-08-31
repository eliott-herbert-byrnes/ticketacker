import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";


type CreateOrgInput = Pick<Prisma.OrganizationCreateInput, "name">;

export async function createOrganizationUpdateMembership(
  data: CreateOrgInput,
  userId: string
): Promise<{ organization: { id: string; name: string }; deactivatedCount: number }> {
  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        ...data,
        memberships: {
          create: {
            userId,
            isActive: true,
            membershipRole: "ADMIN",
          },
        },
      },
      select: { id: true, name: true },
    });

    const { count: deactivatedCount } = await tx.membership.updateMany({
      where: {
        userId,
        organizationId: { not: organization.id },
        isActive: true,
      },
      data: { isActive: false },
    });

    return { organization, deactivatedCount };
  });
}

export const deleteOrganization = async (id: string) => {
    return await prisma.organization.delete({
      where: {
        id,
      },
    });
}

export const updateOrganization = async (id: string, name: string) => {
    return await prisma.organization.update({
      where: { id },  
      data:  { name },                 
    });
}

export async function updateMembershipByOrganization(
  userId: string,
  organizationId: string
) {
  return prisma.$transaction(async (tx) => {
    await tx.membership.updateMany({
      where: {
        userId,
        organizationId: { not: organizationId },
        isActive: true,
      },
      data: { isActive: false },
    });

    return tx.membership.update({
      where: { membershipId: { userId, organizationId } },
      data: { isActive: true },
    });
  });
}