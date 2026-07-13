import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend NextAuth types to recognize your custom user backend payload fields
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
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      accessToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials, req) {
        // Your logic to verify credentials against your backend: http://192.168.1.90:8080/api/user/login
        if (credentials?.email && credentials?.password) {
          return { 
            id: "1", 
            email: credentials.email, 
            name: "User", 
            role: credentials.role ?? "technician", // Ensures a string fallback value
            accessToken: "token",
            sessionId: "session",
            tenantId: "tenant",
            userType: "user"
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Pass user role from backend profile into the token payload
      if (user) {
        token.role = user.role; 
        token.accessToken = user.accessToken; // Retains access token in JWT context
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token role payload to client-side session contexts
      if (session.user && token) {
        session.user.role = token.role;
        session.user.accessToken = token.accessToken; // Retains access token exposure to client hooks
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", // Redirects NextAuth internal authentication tasks to your custom login page layout
    signOut: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };