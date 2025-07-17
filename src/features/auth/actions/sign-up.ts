"use server";

import { hash } from "@node-rs/argon2";
import { Prisma } from "@prisma/client";
// import { redirect } from "next/navigation";
import { z } from "zod";
import { ActionState,fromErrorToActionState, toActionState } from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";

const signUpSchema = z.object({
  username: z.string().min(1).max(191).refine(v => !v.includes(" "), "Username cannot contain spaces"),
  email: z.string().min(1, "Is required").max(191).email(),
  password: z.string().min(6).max(191),
  confirmPassword: z.string().min(6).max(191),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
  }
});

export const signUp = async (_state: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    const data = signUpSchema.parse(Object.fromEntries(formData));
    const { username, email, password } = data;
    const passwordHash = await hash(password);

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    return toActionState("SUCCESS", "Account created successfully");
  } catch (error) {
    // Handle Prisma duplicate error gracefully
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return toActionState("ERROR", "Username or email already in use", formData);
    }

    // Handle Zod or unknown errors
    return fromErrorToActionState(error, formData);
  }
};
