// import { resend } from "resend";
import WeeklyUserRoundup from "@/emails/background-jobs/weekly-user-roundup";
import { resend } from "@/lib/resend"

export type WeeklyUserRoundupResult =
| {data: unknown; error?: undefined}
| {error: {name?: string; message?: string}; data?: undefined}

export const sendWeeklyUserRoundupEmail = async (args: {
  to: string;
  count: number;
  rangeStart: Date;
  rangeEnd: Date;
}) => {
  const { data, error } = await resend.emails.send({
    from: "no-reply@app.ticketacker.com",
    to: args.to,
    subject: "Weekly signup summary",
    react: WeeklyUserRoundup({
      count: args.count,
      rangeStart: args.rangeStart.toISOString(),
      rangeEnd: args.rangeEnd.toISOString(),
    }) as React.ReactElement,
  });

  if (error) return { error };
  return { data };
}
