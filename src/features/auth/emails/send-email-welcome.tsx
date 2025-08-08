import EmailWelcome from "@/emails/signUp/email-welcome"
import { resend } from "@/lib/resend"

export const EmailWelcomeEmail = async (
    username: string,
    email: string,
    signInLink: string,
) => {
return await resend.emails.send({
    from: "no-reply@app.ticketacker.com",
    to: email,
    subject: "Welcome to TickeTacker",
    react: <EmailWelcome toName={username} url={signInLink}/>
})
}