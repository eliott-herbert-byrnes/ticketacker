import {EventSchemas, Inngest} from 'inngest'
import { WeeklyUserRoundupEventArgs } from '@/features/background-jobs/events/weekly-user-roundup';
import { PasswordResetEventArgs } from '@/features/password/events/event-password-event'
import { WelcomeEmailEventArgs } from '@/features/password/events/event-welcome-events';

type Events = {
    "app/password.password-reset": PasswordResetEventArgs;
    "app/welcome.welcome-email": WelcomeEmailEventArgs;
    "app/weekly.user-roundup": WeeklyUserRoundupEventArgs
}

export const inngest = new Inngest({
    id: "tickeTacker",
    schemas: new EventSchemas().fromRecord<Events>(),
})