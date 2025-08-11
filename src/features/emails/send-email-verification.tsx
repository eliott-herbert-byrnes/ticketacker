import EmailVerification from "@/emails/auth/email-verification"
import { resend } from "@/lib/resend"

export const sendEmailVerification = async (
    username: string,
    email: string,
    code: string,
) => {
return await resend.emails.send({
    from: "no-reply@app.ticketacker.com",
    to: email,
    subject: "Verification Code from Ticketacker",
    react: <EmailVerification toName={username} code={code}/>
})
}