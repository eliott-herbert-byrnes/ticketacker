import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

export type ProcessInvitationsEvent = {
  data: {
    userId: string;
    email: string;
  };
};

export const processInvitationsFn = inngest.createFunction(
  { id: "membership-process-invitations", retries: 3 },
  { event: "app/membership.process-invitations" },
  async ({ event, step }) => {
    const { userId, email } = event.data;

    const invitations = await step.run("load-invitations", () =>
      prisma.invitation.findMany({ where: { email } })
    );

    if (!invitations.length) {
      return { fanout: 0 };
    }

    await step.sendEvent(
      "fanout-membership-create",
      invitations.map((inv) => ({
        name: "app/membership.create",
        data: {
          userId,
          organizationId: inv.organizationId,
          email: inv.email,
        },
      }))
    );

    return { fanout: invitations.length };
  }
);
