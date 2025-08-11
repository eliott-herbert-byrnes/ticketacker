import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      emailVerified: Date | null;
      username?: string;
      lastSignedIn?: Date;
    };
  }

  interface User {
    id: string;
    emailVerified: Date | null;
    username?: string;
    lastSignedIn?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: Date | null;
    username?: string;
    lastSignedIn?: Date;
  }
}