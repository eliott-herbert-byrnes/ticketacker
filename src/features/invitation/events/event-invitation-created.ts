import { inngest } from "@/lib/inngest";
import { sendEmailInvitation } from "../emails/send-email-invitation";
import * as membershipData from "./data";

export type InvitationCreateEventArgs = {
  data: {
    userId: string;
    organizationId: string;
    email: string;
    emailInvitationLink: string;
  };
};

export const invitationCreateEvent = inngest.createFunction(
  { id: "invitation-created" },
  { event: "app/invitation.created" },
  async ({ event }) => {
    const { userId, organizationId, email, emailInvitationLink } = event.data;

    const user = await membershipData.findUser(userId);

    const organization = await membershipData.findOrganization(organizationId);

    const result = await sendEmailInvitation(
      user.username,
      organization.name,
      email,
      emailInvitationLink
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: true };
  }
);
