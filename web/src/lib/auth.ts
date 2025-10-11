import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type JwtToken = { role?: string; [key: string]: unknown };
type UserWithRole = { role?: string; [key: string]: unknown };
type SessionWithUser = {
  user?: { role?: string; [key: string]: unknown };
  [key: string]: unknown;
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {} as Parameters<typeof prismaAdapter>[1]), // keep this as-is

  emailAndPassword: {
    enabled: true,
  },

  callbacks: {
    async jwt({ token, user }: { token: JwtToken; user?: UserWithRole }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: SessionWithUser;
      token: JwtToken;
    }) {
      // 🧠 This ensures the session also has the role
      if (session.user && token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});
