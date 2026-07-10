import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    accessToken: string;
    sessionId: string;
    tenantId: string;
    userType: string;
    role: string;
  }

  interface Session {
    accessToken: string;
    sessionId: string;
    tenantId: string;
    userType: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    sessionId: string;
    tenantId: string;
    userType: string;
    role: string;
  }
}