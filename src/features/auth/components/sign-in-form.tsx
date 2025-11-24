"use client";

// Sign in disabled for MVP (Demo mode only)
import { LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { FieldError } from "@/components/form/field-error";
// import { Form } from "@/components/form/form";
// import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { signInAction } from "../actions/sign-in";
import { signInDemoAction } from "../actions/sign-in-demo";

type SignInData = {
  redirectTo: string;
  rateLimit?: { retryAfter?: number; remaining: number };
};

export function SignInForm() {
  const router = useRouter();
  // const [actionState, action] = useActionState(
  //   signInAction,
  //   EMPTY_ACTION_STATE as ActionState<SignInData>
  // );

  const [demoActionState, demoAction] = useActionState(
    signInDemoAction,
    EMPTY_ACTION_STATE as ActionState<SignInData>
  );

  const [cooldown, setCooldown] = useState<number>(0);
  const [demoPending, setDemoPending] = useState<boolean>(false);

  // Check if demo mode is enabled
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  // useEffect(() => {
  //   if (actionState.status === "ERROR") {
  //     const retryAfter = actionState.data?.rateLimit?.retryAfter ?? 0;
  //     if (retryAfter > 0) setCooldown(retryAfter);
  //   }
  // }, [actionState]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // useEffect(() => {
  //   if (actionState.status === "SUCCESS") {
  //     router.refresh();

  //     if (actionState.data?.redirectTo) {
  //       router.push(actionState.data.redirectTo);
  //     }
  //   }
  // }, [actionState, router]);

  useEffect(() => {
    if (demoActionState.status === "SUCCESS") {
      router.refresh();

      if (demoActionState.data?.redirectTo) {
        router.push(demoActionState.data.redirectTo);
      }
    } else if (demoActionState.status === "ERROR") {
      setDemoPending(false);
    }
  }, [demoActionState, router]);

  // const attemptsRemaining = actionState.data?.rateLimit?.remaining;

  const handleDemoSignIn = async () => {
    setDemoPending(true);
    await demoAction(new FormData());
  };

  return (
    <div className="space-y-4">
      {isDemoMode && (
        <>
          <Button
            variant="default"
            className="w-full cursor-pointer"
            onClick={handleDemoSignIn}
            disabled={demoPending}
            type="button"
          >
            {demoPending ? (
              <LucideLoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              "🚀 Sign in with Demo"
            )}
          </Button>

          {demoActionState?.status === "ERROR" && (
            <p className="text-red-500 text-sm" role="alert" aria-live="polite">
              {demoActionState.message}
            </p>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            {/* Sign in form disabled for MVP */}
            {/* <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div> */}
          </div>
        </>
      )}

      {/* Sign in form disabled for MVP */}
      {/* <Form action={action} actionState={actionState}>
        <Input name="email" placeholder="john@example.com" />
        <FieldError actionState={actionState} name="email" />

        <Input name="password" type="password" placeholder="••••••••" />
        <FieldError actionState={actionState} name="password" />

        {actionState?.status === "ERROR" && (
          <p
            className="text-red-500 text-sm mt-2"
            role="alert"
            aria-live="polite"
          >
            {actionState.message}
            {cooldown > 0 && (
              <>
                Try again in <strong>{cooldown}s</strong>.
              </>
            )}
          </p>
        )}

        {typeof attemptsRemaining === "number" &&
          attemptsRemaining >= 0 &&
          cooldown === 0 && (
            <p
              className="text-xs mt-2 text-muted-foreground"
              aria-live="polite"
            >
              Attempts Remaining: {attemptsRemaining}
            </p>
          )}

        <div className="mt-2">
          <SubmitButton
            label={cooldown > 0 ? `Try again in ${cooldown}s` : "Sign In"}
            disabled={cooldown > 0}
          />
        </div>
      </Form> */}
    </div>
  );
}
