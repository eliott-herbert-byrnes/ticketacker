import {EventSchemas, Inngest} from 'inngest'
import { AttachmentDeleteEventArgs } from '@/features/attachments/events/event-attachment-deleted';
import { EmailVerificationForEmailChangeArgs } from '@/features/auth/events/event-email-change';
import { EmailVerificationEventArgs } from '@/features/auth/events/event-email-verification';
import { WeeklyUserRoundupEventArgs } from '@/features/background-jobs/events/weekly-user-roundup';
import { CreateMembershipEvent } from '@/features/invitation/events/event-create-membersip';
import { InvitationCreateEventArgs } from '@/features/invitation/events/event-invitation-created';
import { ProcessInvitationsEvent } from '@/features/membership/events/event-process-invitations';
import { OrganizationCreateEventArgs } from '@/features/organization/events/event-organization-created';
import { PasswordResetEventArgs } from '@/features/password/events/event-password-event'
import { WelcomeEmailEventArgs } from '@/features/password/events/event-welcome-events';

type Events = {
    "app/password.password-reset": PasswordResetEventArgs;
    "app/welcome.welcome-email": WelcomeEmailEventArgs;
    "app/weekly.user-roundup": WeeklyUserRoundupEventArgs;
    "app/auth.sign-up": EmailVerificationEventArgs;
    "app/auth.email-change-request": EmailVerificationForEmailChangeArgs;
    "app/invitation.created": InvitationCreateEventArgs;
    "app/membership.process-invitations": ProcessInvitationsEvent;
    "app/membership.create": CreateMembershipEvent;
    "app/attachment.deleted": AttachmentDeleteEventArgs;
    "app/organization.created": OrganizationCreateEventArgs
}

export const inngest = new Inngest({
    id: "tickeTacker",
    schemas: new EventSchemas().fromRecord<Events>(),
})