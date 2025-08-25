import { subDays } from "date-fns";
import {
  sendWeeklyUserRoundupEmail,
  WeeklyUserRoundupResult,
} from "@/features/password/emails/send-weekly-user-roundup";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

export type WeeklyUserRoundupEventArgs = {
  data: object;
};

export const weeklyUserRoundupFn = inngest.createFunction(
  { id: "weekly-user-roundup" },
  { cron: "0 9 * * 1" },
  async ({ step }) => {
    const rangeEnd = new Date();
    const rangeStart = subDays(rangeEnd, 7);

    const count = await step.run("count-new-users", async () => {
      return prisma.user.count({
        where: {
          createdAt: {
            gte: rangeStart,
            lt: rangeEnd,
          },
        },
      });
    });

    const admin = await step.run("get-admin-user", async () => {
      return prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { email: true },
      });
    });

    const to = admin?.email ?? "eliott.c.h.byrnes@googlemail.com";
    if (!to) {
      throw new Error(
        "No admin recipient configured (role=ADMIN or ADMIN_EMAIL env)."
      );
    }

    await step.run("send-admin-email", async () => {
      const result: WeeklyUserRoundupResult = await sendWeeklyUserRoundupEmail({
        to,
        count,
        rangeStart,
        rangeEnd,
      });

      if (result.error) {
        throw new Error(
          `${result.error.name ?? "EmailError"}: ${result.error.message ?? "Failed to send weekly roundup"}`
        );
      }
    });

    return { count, rangeStart, rangeEnd };
  }
);
