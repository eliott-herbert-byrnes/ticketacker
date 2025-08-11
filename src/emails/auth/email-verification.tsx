import {
  Body,
  Container,
  Head,
  Html,
  // Img,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailVerificationProps = {
  toName: string;
  code: string;
};

const EmailVerification = ({ toName, code }: EmailVerificationProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-800">
          <Container className="bg-white shadow-md rounded-md my-10 mx-auto p-8 max-w-md">
            {/* Header / Logo */}
            <Section className="text-center mb-6">
              {/* <Img
                src="https://ticketacker.com/logo.svg"
                alt="TickeTacker logo"
                width="40"
                height="40"
                className="mx-auto mb-4"
              /> */}
              <Text className="text-xl font-semibold text-gray-900">
                Email Verification Code
              </Text>
            </Section>

            {/* Body */}
            <Section>
              <Text className="text-left mb-4">Hello {toName},</Text>
              <Text className="text-left mb-6">
                Please verify your email with the following code:
              </Text>
            </Section>

            {/* Verification */}
            <Section className="text-center">
              <Text
                className="bg-black text-white font-medium py-3 px-6 rounded-md"
              >
                {code}
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

EmailVerification.PreviewProps = {
    toName: "Eliott Herbert-Byrnes",
    code: "ASDFGHJK",
} as EmailVerificationProps

export default EmailVerification;
