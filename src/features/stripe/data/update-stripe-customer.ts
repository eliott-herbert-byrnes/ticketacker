import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const updateStripeCustomer = async (
  subscription: Stripe.Subscription,
  eventAt: number
) => {
  const res = (await prisma.stripeCustomer.updateMany({
    where: {
      customerId: subscription.customer as string,
      OR: [{ eventAt: null }, { eventAt: { lt: eventAt } }],
    },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      productId: (subscription.items.data[0]?.price.product as string) ?? null,
      priceId: subscription.items.data[0]?.price.id ?? null,
      eventAt,
    },
  })) as Prisma.BatchPayload;

  if (res.count === 0){
    console.warn(
      "[stripe] update skipped (no row or older event)",
      { customer: subscription.customer, eventAt }
    )
  }
};
