import {serve} from "inngest/next"
import { weeklyUserRoundupFn } from "@/features/background-jobs/events/weekly-user-roundup"
import { passwordResetFunction } from "@/features/password/events/event-password-event"
import { welcomeEventFunction } from "@/features/password/events/event-welcome-events"
import {inngest} from '../../../lib/inngest'

export const {GET, POST, PUT} = serve({
    client: inngest,
    functions: [passwordResetFunction, welcomeEventFunction, weeklyUserRoundupFn],
})
