// src/app/sign-out/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { CardCompact } from "@/components/card-compact";
import { Button } from "@/components/ui/button"; // use your own component

export default function SignOutPage() {
  const router = useRouter();

  return (
    <CardCompact
      title="Sign Out"
      description="Are you sure you are ready to sign out?"
      className="w-full max-w-[420px] animate-fade-from-top self-center"
      content={""}
      footer={
        <>
          <div className="flex flex-row gap-2 w-full">
            <Button
              variant="default"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="cursor-pointer"
            >
              Yes, sign me out
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </>
      }
    />
  );
}
