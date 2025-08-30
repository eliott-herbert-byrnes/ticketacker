"use server";
import { organizationPath } from "@/app/paths";
import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import { hashToken } from "@/utils/crypto";
import * as invitationData from "../data";

export const acceptInvitation = async (tokenId: string) => {
  try {
    const tokenHash = hashToken(tokenId);
    const auth = await getAuth();

    const invitation = await invitationData.findInvitation(tokenHash);

    if (!invitation) {
      return toActionState("ERROR", "Revoked or invalid verification token");
    }

    if (auth.user) {
      if (
        auth.user.email &&
        auth.user.email.toLowerCase() !== invitation.email.toLocaleLowerCase()
      ) {
        return toActionState(
          "ERROR",
          "You're signed in as a different account. Please switch accounts"
        );
      }
    }

    const user = await invitationData.findUser(invitation.email);

    if (user) {
      await invitationData.acceptInvitationForExistingUser(
        tokenHash,
        invitation.organizationId,
        user.id
      );
    } else {
      await invitationData.markInvitationAcceptedWithoutAccount(tokenHash);
    }

    return {
      ...toActionState("SUCCESS", "Invite accepted, membership created"),
      data: { redirectTo: organizationPath() },
    };
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
