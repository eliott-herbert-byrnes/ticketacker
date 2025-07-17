'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


export const getAuth = async () => {
  const session = await getServerSession(authOptions);

  return {
    user: session?.user ?? null,
    session,
  };
};
