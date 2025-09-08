import Stripe from "stripe";
import * as stripeData from "@/features/stripe/data";
import { prisma } from "@/lib/prisma";
import { enforceProvisioningForOrganization } from "./enforce-provisioning";

export const onSubscriptionCreated = async (
  subscription: Stripe.Subscription,
  eventAt: number
) => {
  await stripeData.updateStripeCustomer(subscription, eventAt);

  const sc = await prisma.stripeCustomer.findUnique({
    where: { customerId: subscription.customer as string },
    select: { organizationId: true },
  });
  if (sc?.organizationId) {
    await enforceProvisioningForOrganization(sc.organizationId);
  }
};
