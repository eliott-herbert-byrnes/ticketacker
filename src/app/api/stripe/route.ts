// import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import * as stripeData from "@/features/stripe/data";
import { onSubscriptionCreated } from "@/features/stripe/webhooks/on-subscription-created";
import { onSubscriptionUpdated } from "@/features/stripe/webhooks/on-subscription-updated";
import { stripe } from "@/lib/stripe";

// const handleSubscriptionDeleted = async (
//   subscription: Stripe.Subscription,
//   eventAt: number
// ) => {
//   await stripeData.deleteStripeSubscription(subscription, eventAt);
// };

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhooksecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhooksecret) {
    return new NextResponse("Missing Webhook Secret", {
      status: 500,
    });
  }

  if (!signature) {
    return new NextResponse("Missing Stripe Signature", {
      status: 400,
    });
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhooksecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed: ", err)
    return new NextResponse("Invalid Stripe Signature", {status: 400})
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub =
            typeof session.subscription === "string"
              ? await stripe.subscriptions.retrieve(session.subscription)
              : (session.subscription as Stripe.Subscription);
          await stripeData.updateStripeCustomer(sub, event.created);
        }
        break;
      }
      case "customer.subscription.created":
        await onSubscriptionCreated(event.data.object, event.created);
        break;
      case "customer.subscription.updated":
        await onSubscriptionUpdated(event.data.object, event.created);
        break;
      case "customer.subscription.deleted":
        await stripeData.deleteStripeSubscription(event.data.object, event.created);
        break;
      default:
        console.log(`Unhandles event type ${event.type}.`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
