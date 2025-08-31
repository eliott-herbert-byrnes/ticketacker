import { EmailWelcomeEmail } from "@/features/auth/emails/send-email-welcome";
import { inngest } from "@/lib/inngest";
import * as passwordData from "../data"

export type WelcomeEmailEventArgs = {
  data: {
    userId: string;
    welcomeUrl?: string;
  };
};

export const welcomeEventFunction = inngest.createFunction(
  {
    id: "send-welcome-email",
  },
  {
    event: "app/welcome.welcome-email",
  },
  async ({ event, step }) => {
    const { userId, welcomeUrl }  = (event as unknown as WelcomeEmailEventArgs).data;

    const user = await passwordData.findOrThrow(userId)

    const url = welcomeUrl ?? "https://www.ticketacker.com/tickets";

    const result = await EmailWelcomeEmail(
      user.username,
      user.email,
      url
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    await step.sleep("wait-a-moment", "3600s")
    return { event, body: result };
  }
);
