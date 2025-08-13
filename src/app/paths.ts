export const homePath = () => '/'
export const ticketsPath = () => '/tickets'
export const ticketPath = (ticketId: string) => `/tickets/${ticketId}`
export const editPath = (ticketId: string) => `/tickets/${ticketId}/edit`


export const signUpPath = () => "/sign-up"
export const signInPath = () => "/sign-in"

export const emailVerificationPath = () => "/email-verification"

export const organizationPath = () => "/organization"
export const onboardingPath = () => "/organization/create"
export const organizationCreatePath = () => "/organization/create"
export const selectActiveOrganizationPath = () => "/onboarding/select-active-organization"

export const passwordForgotPath = () => "/password-forgot"
export const passwordResetPath = () => "/password-reset"

export const accountProfilePath = () => "/account/profile"
export const accountPasswordPath = () => "/account/password"