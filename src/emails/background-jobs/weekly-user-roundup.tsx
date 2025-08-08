import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type Props = {
  count: number;
  rangeStart: string;
  rangeEnd: string;
};

const WeeklyUserRoundup = ({ count, rangeStart, rangeEnd }: Props) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-800">
          <Container className="bg-white shadow-md rounded-md my-10 mx-auto p-8 max-w-md">
            <Section className="text-center mb-6">
              <Text className="text-xl font-semibold text-gray-900">
                Weekly User Signups
              </Text>
            </Section>
            <Section className="text-center mb-4">
              <Text className="text-center mb-6">
                {" "}
                Range: {new Date(rangeStart).toUTCString()} →{" "}
                {new Date(rangeEnd).toUTCString()}
              </Text>
              <Text className="text-center mb-6">
                Total new users: <strong>{count}</strong>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WeeklyUserRoundup;
