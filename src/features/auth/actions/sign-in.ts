"use server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { z } from "zod";
import { ticketsPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { signIn } from "@/lib/auth";

const signInSchema = z.object({
  email: z.string().min(1, { message: "Is Required" }).max(191).email(),
  password: z.string().min(6).max(191),
});

const redis = Redis.fromEnv();
const prefixEnv = process.env.NODE_ENV === "production" ? "prod" : "dev";
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: `rl:${prefixEnv}:sign-in`,
});

async function getClientIp(): Promise<string> {
  const h = await headers();

  const normalize = (ip?: string | null) => {
    if (!ip) return "unknown";
    const first = ip.split(",")[0]!.trim();
    return first === "::1" ? "127.0.0.1" : first;
  };

  const xff = h.get("x-forwarded-for");
  if (xff) return normalize(xff);

  const ip = h.get("x-real-ip") ?? h.get("cf-connecting-ip");
  return normalize(ip);
}

export async function signInAction(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  const ip = await getClientIp();
  const { success, reset, remaining, limit } = await ratelimit.limit(
    `ip:${ip}`
  );

  console.log("[sign-in rate-limit]", {
    ip,
    success,
    remaining,
    limit,
    reset,
  });

  try {
    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return toActionState(
        "ERROR",
        "Too many login attempts. Please try again later. ",
        formData,
        { rateLimit: { retryAfter, remaining: 0 } }
      );
    }

    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error
    ) {
      return toActionState("ERROR", "Incorrect email or password", formData, {
        rateLimit: { remaining },
      });
    }

    return toActionState("SUCCESS", "Successfully signed in", undefined, {
      redirectTo: ticketsPath(),
      rateLimit: { remaining },
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return toActionState("ERROR", "Incorrect email or password", formData, {
        rateLimit: { remaining },
      });
    }
    return fromErrorToActionState(err, formData);
  }
}
