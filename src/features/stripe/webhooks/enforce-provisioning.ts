import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const enforceProvisioningForOrganization = async (
  organizationId: string
) => {
  await prisma.$transaction(async (tx) => {
    const stripeCustomer = await tx.stripeCustomer.findUnique({
      where: { organizationId },
    });

    let allowedMembers = 1;
    if (
      stripeCustomer?.subscriptionStatus === "active" &&
      stripeCustomer.productId
    ) {
      const product = await stripe.products.retrieve(stripeCustomer.productId);
      const raw = product.metadata?.allowedMembers;

      allowedMembers =
        raw && !Number.isNaN(Number(raw))
          ? Number(raw)
          : Number.MAX_SAFE_INTEGER;
    }

    const [members, pendingInvites] = await Promise.all([
      tx.membership.findMany({
        where: { organizationId },
        orderBy: [
          {
            membershipRole: "asc",
          },
          {
            joinedAt: "desc",
          },
        ],
      }),
      tx.invitation.findMany({
        where: { organizationId, status: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const total = members.length + pendingInvites.length;
    if (total <= allowedMembers) return;

    let toRemove = total - allowedMembers;

    let removedInvites = 0;
    if (pendingInvites.length > 0 && toRemove > 0) {
      const invitesToDelete = pendingInvites.slice(0, toRemove);
      await tx.invitation.deleteMany({
        where: {
          organizationId,
          status: "PENDING",
          email: { in: invitesToDelete.map((i) => i.email) },
        },
      });
      removedInvites = invitesToDelete.length;
      toRemove -= removedInvites;
    }

    if (toRemove <= 0) return;

    const nonAdmins = members.filter((m) => m.membershipRole === "MEMBER");
    const admins = members.filter((m) => m.membershipRole === "ADMIN");

    const deletions: Array<{ organizationId: string; userId: string }> = [];

    for (const m of nonAdmins) {
      if (toRemove <= 0) break;
      deletions.push({ organizationId, userId: m.userId });
      toRemove--;
    }

    if (toRemove > 0) {
      const adminRemovals: Array<{ organizationId: string; userId: string }> =
        [];
      let removableAdmins = admins.length - 1;
      for (
        let i = admins.length - 1;
        i >= 0 && toRemove > 0 && removableAdmins > 0;
        i--
      ) {
        adminRemovals.push({ organizationId, userId: admins[i].userId });
        toRemove--;
        removableAdmins--;
      }
      deletions.push(...adminRemovals);
    }

    if (deletions.length > 0) {
      await Promise.all(
        deletions.map((d) =>
          tx.membership.delete({
            where: {
              membershipId: {
                organizationId: d.organizationId,
                userId: d.userId,
              },
            },
          })
        )
      );
    }
  });
};
