import {EventSchemas, Inngest} from 'inngest'
import { EmailVerificationForEmailChangeArgs } from '@/features/auth/events/event-email-change';
import { EmailVerificationEventArgs } from '@/features/auth/events/event-email-verification';
import { WeeklyUserRoundupEventArgs } from '@/features/background-jobs/events/weekly-user-roundup';
import { PasswordResetEventArgs } from '@/features/password/events/event-password-event'
import { WelcomeEmailEventArgs } from '@/features/password/events/event-welcome-events';

type Events = {
    "app/password.password-reset": PasswordResetEventArgs;
    "app/welcome.welcome-email": WelcomeEmailEventArgs;
    "app/weekly.user-roundup": WeeklyUserRoundupEventArgs;
    "app/auth.sign-up": EmailVerificationEventArgs;
    "app/auth.email-change-request": EmailVerificationForEmailChangeArgs;
}

export const inngest = new Inngest({
    id: "tickeTacker",
    schemas: new EventSchemas().fromRecord<Events>(),
})