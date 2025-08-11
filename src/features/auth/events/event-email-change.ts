// src/features/auth/events/event-email-change.ts
import { sendEmailVerification } from "@/features/emails/send-email-verification";
import { inngest } from "@/lib/inngest";

export type EmailVerificationForEmailChangeArgs = {
    data: {
        userId: string;
        username: string;
        email: string;
        code: string;
    }
}

export const sendEmailVerificationForEmailChange = inngest.createFunction(
  { id: "email-verification-change" },
  { event: "app/auth.email-change-request" },
  async ({ event }) => {
    const { username, email, code } = event.data as {
      userId: string;
      username: string;
      email: string;
      code: string;
    };

    const result = await sendEmailVerification(username, email, code);

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { ok: true };
  }
);
