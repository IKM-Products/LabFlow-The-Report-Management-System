import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/services/auth.service";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Operational Credentials Gateway",
      credentials: {
        email: { label: "System Matrix Email", type: "text" },
        password: { label: "Cryptographic Key Token", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing structural credential configurations.");
        }
        try {
          const authData = await authService.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (authData.success && authData.data) {
            return {
              id: authData.data.user_id,
              email: credentials.email,
              access_token: authData.data.access_token,
              session_id: authData.data.session_id,
              user_id: authData.data.user_id,
              user_type: authData.data.user_type,
            };
          }
          return null;
        } catch (error: any) {
          const errorMsg = error?.messages?.join(", ") || "Handshake verification execution breakdown";
          throw new Error(errorMsg);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token;
        token.sessionId = user.session_id;
        token.userId = user.user_id;
        token.userType = user.user_type;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.sessionId = token.sessionId;
      session.userId = token.userId;
      session.userType = token.userType;
      if (session.user) {
        session.user.id = token.userId || "";
        session.user.role = token.userType;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour token validation window
  },
  secret: process.env.NEXTAUTH_SECRET || "SUPER_SECRET_NODE_ENVIRONMENT_TOKEN_DESCRIPTOR_PHRASE",
};