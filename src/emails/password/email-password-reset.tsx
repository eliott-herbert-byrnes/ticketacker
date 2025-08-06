import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailPasswordResetProps = {
  toName: string;
  url: string;
};

const EmailPasswordReset = ({ toName, url }: EmailPasswordResetProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-800">
          <Container className="bg-white shadow-md rounded-md my-10 mx-auto p-8 max-w-md">
            {/* Header / Logo */}
            <Section className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Img
                  src="https://ticketacker.com/logo.svg"
                  alt="Logo"
                  width="40"
                  height="40"
                />
              </div>
              <Text className="text-xl font-semibold text-gray-900">
                Password Reset Request
              </Text>
            </Section>

            {/* Body */}
            <Section>
              <Text className="text-left mb-4">Hello {toName},</Text>
              <Text className="text-left mb-6">
                We received a request to reset your password. Click the button
                below to choose a new one. This link will expire in 2 hours for
                your security.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center">
              <Button
                href={url}
                className="bg-black text-white font-medium py-3 px-6 rounded-md"
              >
                Reset Password
              </Button>
            </Section>

            {/* Fallback Link */}
            <Section className="mt-6">
              <Text className="text-xs text-gray-500 text-left">
                If the button above doesn’t work, you can copy and paste this
                URL into your browser:
              </Text>
              <Text className="text-xs text-blue-600 break-all text-left">
                {url}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-500 text-center">
              <Text>
                If you didn’t request this, you can safely ignore this email.
              </Text>
              <Text className="mt-2">
                © {new Date().getFullYear()} TickeTacker. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailPasswordReset;
