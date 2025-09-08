import { prisma } from "@/lib/prisma";

export const getOrgStripeFeatures = async (organizationId: string | undefined) => {

  if(!organizationId) return {canMakePrivateTickets: false}  

  const sc = await prisma.stripeCustomer.findUnique({
    where: { organizationId },
  });

  const active = sc?.subscriptionStatus === "active";
  if (!active) return { canMakePrivateTickets: false };

  return { canMakePrivateTickets: true };
};
