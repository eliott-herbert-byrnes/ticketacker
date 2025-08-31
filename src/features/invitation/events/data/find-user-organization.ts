import { prisma } from "@/lib/prisma";

export const findUser = async (id: string) => {
    return await prisma.user.findUniqueOrThrow({
          where: {
            id,
          },
        });
}

export const findOrganization = async (id: string) => {
  return await prisma.organization.findUniqueOrThrow({
      where: {
        id,
      },
    });

}