"use server";

import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ticketsPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";

const signInSchema = z.object({
  email: z.string().min(1, { message: "Is Required" }).max(191).email(),
  password: z.string().min(6).max(191),
});

export const signIn = async (_actionState: ActionState, formData: FormData) => {
  try {
    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    const valid = await verify(user.passwordHash, password);
    if (!valid) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    const params = new URLSearchParams();
    params.set("callbackUrl", ticketsPath());
    params.set("email", email);
    params.set("password", password);

    redirect(`/api/auth/callback/credentials?${params.toString()}`);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
};
