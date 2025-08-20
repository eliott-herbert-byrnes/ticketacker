import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

export type CreateMembershipEvent = {
  data: {
    userId: string;
    organizationId: string;
    email: string;
  };
};


export const createMembershipFn = inngest.createFunction(
  { id: "membership-create", retries: 5, concurrency: { limit: 20 } },
  { event: "app/membership.create" },
  async ({ event, step }) => {
    const { userId, organizationId, email } = event.data; 

    await step.run("delete-invitation-and-upsert-membership", async () => {
      await prisma.$transaction(async (tx) => {
        await tx.invitation.delete({
          where: { invitationId: { organizationId, email } },
        });
        // Alternatively:
        // await tx.invitation.deleteMany({ where: { organizationId, email } });

        // Idempotent upsert by composite PK on Membership (@@id(name: "membershipId", [organizationId, userId]))
        await tx.membership.upsert({
          where: { membershipId: { organizationId, userId } },
          create: {
            organizationId,
            userId,
            membershipRole: "MEMBER",
            isActive: false,
          },
          update: {},
        });
      });
    });

    return { ok: true };
  }
);
