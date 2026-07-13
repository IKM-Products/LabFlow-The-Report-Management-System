import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    role: string;
    accessToken: string;
    sessionId: string;
    tenantId: string;
    userType: string;
  }

  interface Session {
    user: {
      [x: string]: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      accessToken: string;
      sessionId: string;
      tenantId: string;
      userType: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken: string;
    sessionId: string;
    tenantId: string;
    userType: string;
  }
}

// 🟢 STEP 1: Define options in an isolated, clean exportable object
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Expected Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please fill in all email and password fields.");
        }

        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.90:8080/api";
          const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Backend server error (${res.status}): Double check your backend routes.`);
          }   

          const backendPayload = await res.json();

          if (!res.ok || !backendPayload || !backendPayload.success) {
            throw new Error(backendPayload?.message || "Invalid email or password combination.");
          }

          const userData = backendPayload.data;
          if (!userData) {
            throw new Error("Invalid response structural signature: 'data' property is missing.");
          }

          const actualDatabaseRole = String(userData.user_type || "")
            .toLowerCase()
            .replace("role_", "")
            .trim();

          const requestedPortal = credentials.role 
            ? String(credentials.role).toLowerCase().replace("role_", "").trim() 
            : "";

          if (requestedPortal && actualDatabaseRole !== requestedPortal) {
            throw new Error(`Unauthorized: Your account does not have access rights to the ${requestedPortal} portal.`);
          }

          return {
            id: String(userData.user_id || "1"),
            email: credentials.email,
            name: "User", 
            role: actualDatabaseRole,
            accessToken: userData.access_token || "", 
            sessionId: userData.session_id || "",      
            tenantId: userData.tenant_id || "",
            userType: userData.user_type || ""          
          };
        } catch (error: any) {
          throw new Error(error.message || "Authentication service is currently unavailable.");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; 
        token.accessToken = user.accessToken; 
        token.sessionId = user.sessionId;
        token.tenantId = user.tenantId;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role;
        session.user.accessToken = token.accessToken; 
        session.user.sessionId = token.sessionId;
        session.user.tenantId = token.tenantId;
        session.user.userType = token.userType;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", 
    signOut: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 🟢 STEP 2: Pass options cleanly to HTTP route handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };