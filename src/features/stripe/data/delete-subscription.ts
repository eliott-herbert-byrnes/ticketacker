import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { enforceProvisioningForOrganization } from "../webhooks/enforce-provisioning";

export const deleteStripeSubscription = async (
  subscription: Stripe.Subscription,
  eventAt: number
) => {
  const res = (await prisma.stripeCustomer.updateMany({
    where: {
      customerId: subscription.customer as string,
      OR: [{ eventAt: null }, { eventAt: { lt: eventAt } }],
    },
    data: {
      subscriptionId: null,
      subscriptionStatus: null,
      productId: null,
      priceId: null,
      eventAt,
    },
  })) as Prisma.BatchPayload;

  if (res.count === 0) {
    console.warn(
      "[stripe] delete skipped (no row or older event)",
      { customer: subscription.customer, eventAt }
    );
  }

  const sc = await prisma.stripeCustomer.findUnique({
    where: { customerId: subscription.customer as string },
    select: { organizationId: true },
  });
  if (sc?.organizationId) {
    await enforceProvisioningForOrganization(sc.organizationId);
  }
};
