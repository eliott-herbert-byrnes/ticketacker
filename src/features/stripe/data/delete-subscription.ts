import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { enforceProvisioningForOrganization } from "../webhooks/enforce-provisioning";

export const deleteStripeSubscription = async (
  subscription: Stripe.Subscription,
  eventAt: number
) => {
  await prisma.stripeCustomer.update({
    where: {
      customerId: subscription.customer as string,
    },
    data: {
      subscriptionId: null,
      subscriptionStatus: null,
      productId: null,
      priceId: null,
      eventAt,
    },
  });

  const sc = await prisma.stripeCustomer.findUnique({
    where: { customerId: subscription.customer as string },
    select: { organizationId: true },
  });
  if (sc?.organizationId) {
    await enforceProvisioningForOrganization(sc.organizationId);
  }
};
