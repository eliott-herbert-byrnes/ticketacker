import { sendEmailVerification } from "@/features/emails/send-email-verification";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { generateEmailVerificationCode } from "../utils/generate-email-verification-code";

export type EmailVerificationEventArgs = {
    data: {
        userId: string;
    }
}

export const sendEmailVerificationEvent = inngest.createFunction(
  { id: "email-verification" },
  { event: "app/auth.sign-up" },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    const code = await generateEmailVerificationCode(user.id, user.email);

    const result = await sendEmailVerification(user.username, user.email, code);

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message})`);
    }

    return {event, body: result}
  }
);
