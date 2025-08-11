// src/features/auth/actions/sign-up.ts
"use server";

import { hash } from "@node-rs/argon2";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ticketsPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { signIn } from "@/lib/auth";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine((v) => !v.includes(" "), "Username cannot contain spaces"),
    email: z.string().min(1, "Is required").max(191).email(),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export async function signUpAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = signUpSchema.parse(Object.fromEntries(formData));
    const username = parsed.username.trim();
    const email = parsed.email.toLowerCase().trim();
    const password = parsed.password;

    const passwordHash = await hash(password);

    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    await inngest.send({
      name: "app/auth.sign-up",
      data: {
        userId: user.id,
      },
    });

    await inngest.send({
      name: "app/welcome.welcome-email",
      data: {
        userId: user.id,
        welcomeUrl: "https://www.ticketacker.com/tickets",
      },
    });

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error
    ) {
      return toActionState(
        "ERROR",
        "Sign in failed after registration",
        formData
      );
    }

    return {
      ...toActionState("SUCCESS", "Account created — signed in"),
      data: { redirectTo: ticketsPath() },
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState(
        "ERROR",
        "Username or email already in use",
        formData
      );
    }
    return fromErrorToActionState(error, formData);
  }
}
