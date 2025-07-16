"use server";

import { redirect } from "next/navigation";
import { signInPath } from "@/app/paths";

export const signOut = async () => {
  redirect("/api/auth/signout?callbackUrl=" + encodeURIComponent(signInPath()));
};
