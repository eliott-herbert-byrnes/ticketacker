// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    emailVerified: boolean | Date | null;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      emailVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    emailVerified: boolean;
  }
}
