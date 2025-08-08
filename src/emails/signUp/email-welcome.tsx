import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailWelcomeProps = {
  toName: string;
  url: string;
};

const EmailWelcome = ({ toName, url }: EmailWelcomeProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-800">
          <Container className="bg-white shadow-md rounded-md my-10 mx-auto p-8 max-w-md">

            {/* Header */}
            <Section className="text-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">
                Welcome to TickeTacker 🎟️
              </Text>
            </Section>

            {/* Body */}
            <Section>
              <Text className="text-left mb-4">Hi {toName},</Text>

              <Text className="text-left mb-4">
                Thanks for joining TickeTacker — we&apos;re thrilled to have you onboard!
              </Text>

              <Text className="text-left mb-6">
                Whether you&apos;re tracking tickets for personal tasks, collaborative projects, or anything in between, TickeTacker is here to help you stay organized and on top of your goals.
              </Text>

              <Text className="text-left mb-6">
                Click the button below to log in and start managing your tickets:
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center">
              <Button
                href={url}
                className="bg-black text-white font-medium py-3 px-6 rounded-md"
              >
                Get Started
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
                If you didn’t create an account with TickeTacker, feel free to ignore this email.
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

export default EmailWelcome;
