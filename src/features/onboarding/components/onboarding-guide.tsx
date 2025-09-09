"use client";

import Link from "next/link";
import { JSX, useEffect, useMemo, useState } from "react";
import { CardCompact } from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";

const STORAGE_KEY_PREFIX = "onboardingDismissed:";

const steps: Array<{
  title: string;
  body: JSX.Element;
}> = [
  {
    title: "Welcome to TickeTacker",
    body: (
      <p className="text-sm text-muted-foreground">
        Thanks for signing up. Lets get you set up in a minute.
      </p>
    ),
  },
  {
    title: "How TickeTacker works",
    body: (
      <p className="text-sm text-muted-foreground">
        Create tickets your organization needs help with, or complete tickets posted by organizations for a fee.
      </p>
    ),
  },
  {
    title: "Create or join an organization",
    body: (
      <p className="text-sm text-muted-foreground">
        To post a ticket you must belong to an organization. Go to the Organization tab to create one and invite members.
      </p>
    ),
  },
  {
    title: "Organization features",
    body: (
      <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
        <li>Invitations: add teammates quickly</li>
        <li>Credentials: generate scoped API credentials</li>
        <li>Memberships: manage roles and permissions</li>
        <li>Subscriptions: unlock premium features</li>
      </ul>
    ),
  },
  {
    title: "Your account",
    body: (
      <p className="text-sm text-muted-foreground">
        Update your profile and security in the Account tab.
      </p>
    ),
  },
];

export function OnboardingGuide() {
  const { user, isFetched } = useAuth();
  const [step, setStep] = useState(0);
  const canGoBack = step > 0;
  const canGoNext = step < steps.length - 1;

  const storageKey = useMemo(
    () => (user?.id ? `${STORAGE_KEY_PREFIX}${user.id}` : undefined),
    [user?.id]
  );

  const [isDismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    const raw = localStorage.getItem(storageKey);
    setDismissed(raw === "1");
  }, [storageKey]);

  const dismiss = () => {
    if (storageKey) localStorage.setItem(storageKey, "1");
    setDismissed(true);
  };

  if (!isFetched || !user || !user.emailVerified || isDismissed) return null;

  const current = steps[step];

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-6 md:left-auto md:w-[360px] z-[60]">
      <CardCompact
        title={current.title}
        description={`Step ${step + 1} of ${steps.length}`}
        content={<div className="pt-1">{current.body}</div>}
        footer={
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={
                      "h-1.5 w-1.5 rounded-full " +
                      (i === step ? "bg-primary" : "bg-muted-foreground/40")
                    }
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canGoBack ? (
                <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    Home
                  </Link>
                </Button>
              )}
              {canGoNext ? (
                <Button variant="default" size="sm" onClick={() => setStep((s) => s + 1)}>
                  Next
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={dismiss}>
                  Done
                </Button>
              )}
            </div>
          </div>
        }
        className="w-full"
      />
      <div className="mt-2 text-right">
        <Button variant="ghost" size="sm" className="text-xs" onClick={dismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
