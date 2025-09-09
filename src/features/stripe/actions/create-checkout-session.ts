'use server'
import { StripeSubscriptionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { pricingPath, signInPath, subscriptionPath } from "@/app/paths";
import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getBaseUrl } from "@/utils/url";

const NON_CANCELED: ReadonlyArray<StripeSubscriptionStatus> = [
  "active",
  "trialing",
  "incomplete",
  "past_due",
  "unpaid",
  "paused",
];

export const createCheckoutSession = async (
  organizationId: string | null | undefined,
  priceId: string
) => {
  if (!organizationId) {
    redirect(signInPath());
  }
  await getAdminOrRedirect(organizationId);

  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });
  if (!stripeCustomer) {
    return toActionState("ERROR", "Stripe customer not found");
  }

  // if(stripeCustomer.subscriptionStatus && NON_CANCELED.includes(stripeCustomer.subscriptionStatus)){
  //   const portal = await stripe.billingPortal.sessions.create({
  //     customer: stripeCustomer.customerId,
  //     return_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`
  //   });
  //   redirect(portal.url!)
  // }

  if (
    stripeCustomer.subscriptionStatus && NON_CANCELED.includes(stripeCustomer.subscriptionStatus)
  ){
    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.customerId,
      return_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`
    });
    redirect(portal.url!)
  }

  const existingSubs = await stripe.subscriptions.list({
    customer: stripeCustomer.customerId,
    status: "all",
    limit: 10,
    expand: ["data.latest_invoice.payment_intent"],
  })
  const liveHasNonCanceled = existingSubs.data.some(s => 
  ["active", "trialing", "incomplete", "past_due", "unpaid", "paused"].includes(s.status)
  )
  if (liveHasNonCanceled){
    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.customerId,
      return_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`
    });
    redirect(portal.url!)
  }

  const price = await stripe.prices.retrieve(priceId);

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    customer: stripeCustomer.customerId,
    mode: "subscription",
    success_url: `${getBaseUrl()}${subscriptionPath(organizationId)}`,
    cancel_url: `${getBaseUrl()}${pricingPath()}`,
    metadata: {
      organizationId,
    },
    subscription_data: {
      metadata: {
        organizationId,
      },
    },
  });

  if (!session.url) {
    return toActionState("ERROR", "Session URL could not be created");
  }

  redirect(session.url);
};
