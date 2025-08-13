// src/features/auth/actions/email-verification.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { setCookieByKey } from "@/app/actions/cookies";
import { ticketsPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";

const emailVerificationSchema = z.object({
  code: z.string().length(8),
});

export const emailVerification = async (
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
    checkOrganization: false,
    checkActiveOrganization: false,
  });

  if (!user) {
    return toActionState("ERROR", "Invalid or expired");
  }

  try {
    const { code } = emailVerificationSchema.parse(
      Object.fromEntries(formData)
    );

    // Look up the token by userId + code, verify not expired
    const token = await prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id as string,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!token) {
      return toActionState("ERROR", "Invalid or expired");
    }

    // Fetch a fresh user copy (email may have changed in other flows)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: { id: true, email: true },
    });

    if (!dbUser) {
      return toActionState("ERROR", "User not found");
    }

    // Branch by whether this is verifying existing email vs changing to a new one
    if (dbUser.email === token.email) {
      // Normal "verify my current email" flow (e.g. post sign-up)
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { emailVerified: new Date() },
      });
    } else {
      // Email change flow: move to the token's email
      const emailTaken = await prisma.user.findUnique({
        where: { email: token.email },
        select: { id: true },
      });
      if (emailTaken) {
        return toActionState("ERROR", "That email is already in use");
      }

      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email: token.email,
          emailVerified: new Date(), // you've just verified the new email
        },
      });
    }

    // Burn this token (and optionally any other outstanding tokens for the user)
    await prisma.emailVerificationToken.delete({
      where: { id: token.id },
    });
    // Optional cleanup:
    // await prisma.emailVerificationToken.deleteMany({ where: { userId: dbUser.id } });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Email verified");
  redirect(ticketsPath());
};
