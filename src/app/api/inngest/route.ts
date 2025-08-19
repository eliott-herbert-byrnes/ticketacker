import {serve} from "inngest/next"
import { sendEmailVerificationForEmailChange } from "@/features/auth/events/event-email-change"
import { sendEmailVerificationEvent } from "@/features/auth/events/event-email-verification"
import { weeklyUserRoundupFn } from "@/features/background-jobs/events/weekly-user-roundup"
import { invitationCreateEvent } from "@/features/invitation/events/event-invitation-created"
import { passwordResetFunction } from "@/features/password/events/event-password-event"
import { welcomeEventFunction } from "@/features/password/events/event-welcome-events"
import {inngest} from '../../../lib/inngest'

export const {GET, POST, PUT} = serve({
    client: inngest,
    functions: [passwordResetFunction, welcomeEventFunction, weeklyUserRoundupFn, sendEmailVerificationEvent, sendEmailVerificationForEmailChange, invitationCreateEvent],
})
