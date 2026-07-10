import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { loginSchema } from "../schema/auth_schema";
import { loginResponse } from "../types/auth_types";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 Days session lifecycle
  },

  providers: [
    CredentialsProvider({
      name: "LabFlow Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
        role: { type: "text" },
      },

      async authorize(credentials) {
        // 1. Zod server-side structured integrity check
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const apiBaseUrl = "http://192.168.1.90:8080/api";
        const loginEndpoint = `${apiBaseUrl}/auth/login`;

        try {
          // 2. Pointing directly to your local network deployment API base endpoint
          const response = await axios.post<loginResponse>(
            loginEndpoint,
            {
              email: parsed.data.email,
              password: parsed.data.password,
              role: credentials?.role?.toUpperCase(),
            },
            {
              headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
            }
          );

          const result = response.data;

          // 3. Confirm API returned operational properties securely
          if (!result || !result.success || !result.data) {
            return null;
          }

          // Return properties mapping directly to your types/auth_types.ts schemas
          return {
            id: result.data.user_id,
            email: parsed.data.email,
            accessToken: result.data.access_token,
            sessionId: result.data.session_id,
            tenantId: result.data.tenant_id,
            userType: result.data.user_type, 
            role: result.data.user_type?.toLowerCase() || credentials?.role?.toLowerCase() || "technician",
          };
        } catch (error: any) {
          console.error("NextAuth authorize network matrix channel breakdown:", {
            message: error.message,
            urlAttempted: loginEndpoint,
            response: error.response?.data
          });
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.sessionId = user.sessionId;
        token.tenantId = user.tenantId;
        token.userType = user.userType;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.sessionId = token.sessionId as string;
        session.tenantId = token.tenantId as string;
        session.userType = token.userType as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};