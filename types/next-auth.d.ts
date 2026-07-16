import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    sessionId?: string;
    userId?: string;
    userType?: string;
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    access_token: string;
    session_id: string;
    user_id: string;
    user_type: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    sessionId?: string;
    userId?: string;
    userType?: string;
  }
}