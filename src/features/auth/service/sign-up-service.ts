'use server'
import { hash } from "@node-rs/argon2";
import { signIn } from "@/lib/auth";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

type SignUpArgs = {
    username: string;
    email: string;
    password: string;
}

export const signUp = async ({username, email, password}: SignUpArgs) => {

const passwordHash = await hash(password)

const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    await inngest.send([
      {
        name: "app/auth.sign-up",
        data: { userId: user.id },
      },
      {
        name: "app/membership.process-invitations",
        data: { userId: user.id, email },
      },
      {
        name: "app/welcome.welcome-email",
        data: {
          userId: user.id,
          welcomeUrl: "https://www.ticketacker.com/tickets",
        },
      },
    ]);

     const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return result;
}