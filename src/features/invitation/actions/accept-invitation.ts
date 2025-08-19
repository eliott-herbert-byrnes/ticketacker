"use server";
import { organizationPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/utils/crypto";

export const acceptInvitation = async (tokenId: string) => {
  try {
    const tokenHash = hashToken(tokenId);
    const auth = await getAuth();

    const invitation = await prisma.invitation.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!invitation) {
      return toActionState("ERROR", "Revoked or invalid verification token");
    }

    if(auth.user){
        if (
            auth.user.email &&
            auth.user.email.toLowerCase() !== invitation.email.toLocaleLowerCase()
        ) {
            return toActionState("ERROR", "You're signed in as a different account. Please switch accounts")
        }
    }

    const user = await prisma.user.findUnique({
      where: {
        email: invitation.email,
      },
    });

    if (user) {
      await prisma.$transaction([
        prisma.invitation.delete({
          where: {
            tokenHash,
          },
        }),
        prisma.membership.create({
          data: {
            organizationId: invitation.organizationId,
            userId: user.id,
            membershipRole: "MEMBER",
            isActive: false,
          },
        }),
      ]);
    } else {
        await prisma.invitation.update({
            where: {
                tokenHash,
            },
            data: {
                status: "ACCEPTED_WITHOUT_ACCOUNT"
            }
        })
    }

    return {
      ...toActionState("SUCCESS", "Invite accepted, membership created"),
      data: { redirectTo: organizationPath() },
    };
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
