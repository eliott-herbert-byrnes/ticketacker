'use server';
import { auth } from "@/lib/auth";

export const getAuth = async () => {
  const session = await auth(); 
  return { user: session?.user ?? null, session };
};