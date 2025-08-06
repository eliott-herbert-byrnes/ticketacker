"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ticketsPath } from "@/app/paths";
import { SubmitButton } from "@/components/form/sumit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push(ticketsPath());
    } else {
      setError("Incorrect email or password");
    }
  };

  return (
    <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
      <Label htmlFor="email">Email</Label>
      <Input
        name="email"
        placeholder="john@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Label htmlFor="password">Password</Label>
      <Input
        name="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="mt-2">
        <SubmitButton label="Sign In" />
      </div>
    </form>
  );
};
