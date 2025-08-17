import { redirect } from "next/navigation";
import { emailVerificationPath, onboardingPath, selectActiveOrganizationPath, signInPath } from "@/app/paths";
import { getOrganizationsByUser } from "@/features/organization/queries/get-organization-by-user";
import { getAuth } from "./get-auth";

type GetAuthOrRedirectOptions = {
  checkEmailVerified?: boolean;
  checkOrganization?: boolean;
  checkActiveOrganization?: boolean;
};

export const getAuthOrRedirect = async (options?: GetAuthOrRedirectOptions) => {
  const {
    checkEmailVerified = true,
    checkOrganization = true,
    checkActiveOrganization = true,
  } = options ?? {};

  const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

  if (checkEmailVerified && !auth.user.emailVerified) {
    redirect(emailVerificationPath());
  }

  let activeOrganization

if (checkOrganization || checkActiveOrganization){
    const organization = await getOrganizationsByUser()

    if(checkOrganization && !organization.length) {
        redirect(onboardingPath())
    }

    activeOrganization = organization.find((organization) => {
      return organization.membershipByUser.isActive
    })

        const hasActive = !!activeOrganization

    if (checkActiveOrganization && !hasActive) {
        redirect(selectActiveOrganizationPath())
    }
}

  return {...auth, activeOrganization};
};
