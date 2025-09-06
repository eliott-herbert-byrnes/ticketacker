import { PrismaAdapter } from "@auth/prisma-adapter";
import { verify } from "@node-rs/argon2";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

const toDateOrNull = (v: unknown): Date | null => {
  if (v == null) return null;
  if (v instanceof Date) return v;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
};

const toDateOrUndef = (v: unknown): Date | undefined => {
  if (v == null) return undefined;
  if (v instanceof Date) return v;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? undefined : d;
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60, 
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorize: async (creds, request) => {
        try {
          const email = String(creds?.email ?? "")
            .toLowerCase()
            .trim();
          const password = String(creds?.password ?? "");

          if (!email || !password) {
            throw new AuthorizationError("Missing credentials");
          }

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              username: true,
              passwordHash: true,
              emailVerified: true,
              lastSignedIn: true,
            },
          });

          // if (!user) {
          //   throw new AuthorizationError("User not found");
          // }
          
          const isValidPassword = await verify(user!.passwordHash, password);


          if (!user || !isValidPassword) {
            throw new AuthorizationError("Incorrect email or password");
          }
          
          return {
            id: String(user.id),
            name: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
            lastSignedIn: user.lastSignedIn ?? undefined,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  events: {
    async signIn({ user }) {
      if (user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastSignedIn: new Date() },
        });
      }
    },
    async createUser({ user }) {
      if (user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: null,
            lastSignedIn: new Date(),
          },
        });
      }
    },
    async linkAccount({ user }) {
      if (user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        const merged: JWT = { ...token, ...session.user } as JWT;
        const rawEV = (merged as unknown as { emailVerified?: unknown })
          .emailVerified;
        const rawLS = (merged as unknown as { lastSignedIn?: unknown })
          .lastSignedIn;
        merged.emailVerified = toDateOrNull(rawEV);
        merged.lastSignedIn = toDateOrUndef(rawLS);
        return merged;
      }

      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified ?? null; 
        token.lastSignedIn = user.lastSignedIn ?? undefined; 
        token.username = user.name ?? undefined;
        return token;
      }

      const rawEV = (token as unknown as { emailVerified?: unknown })
        .emailVerified;
      const rawLS = (token as unknown as { lastSignedIn?: unknown })
        .lastSignedIn;
      token.emailVerified = toDateOrNull(rawEV);
      token.lastSignedIn = toDateOrUndef(rawLS);

      if (!token.emailVerified && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { emailVerified: true, username: true, lastSignedIn: true },
        });
        if (dbUser) {
          token.emailVerified = dbUser.emailVerified ?? null;
          token.username = dbUser.username ?? token.username;
          token.lastSignedIn = dbUser.lastSignedIn ?? token.lastSignedIn;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.emailVerified =
          (token.emailVerified as Date | null) ?? null;
        session.user.username = token.username as string | undefined;
        session.user.lastSignedIn = token.lastSignedIn as Date | undefined;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/auth-error",
    signOut: "/sign-out",
    verifyRequest: "/verify-request",
  },

  debug: process.env.NODE_ENV === "development",
});
