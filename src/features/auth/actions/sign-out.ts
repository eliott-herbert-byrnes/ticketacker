"use server";

import { signInPath } from "@/app/paths";
import { signOut } from "@/lib/auth";

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: signInPath() }); 
}
