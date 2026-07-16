// src/lib/auth.ts

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { login } from "@/services/auth.service";
import { publicApi } from "@/config/axios";

// Debug trigger to verify this file is being bundled and executed
throw new Error("NEW AUTH FILE IS RUNNING");

interface ProfileResponse {
  data: {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role_name: "ROLE_ADMIN" | "ROLE_TECHNICIAN";
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      // ALIGNED: Changed key from 'email' to 'username' to match LoginPage & loginSchema
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        console.log("========== AUTHORIZE CALLED ==========");
        console.log("Credentials:", credentials);

        // ALIGNED: Check credentials.username instead of credentials.email
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          console.log("Missing email or password");
          return null;
        }

        try {
          console.log("Calling login API...");
          
          // ALIGNED: Pass username to login service
          const loginResponse = await login({
            email: credentials.email,
            password: credentials.password,
          });

          console.log("Login Response:");
          console.log(loginResponse);

          const accessToken = loginResponse.data.access_token;

          if (!accessToken) {
            return null;
          }

          /* -------------------------------------------------------------------------- */
          /* Get Logged In User                                                         */
          /* -------------------------------------------------------------------------- */

          const profileResponse =
            await publicApi.get<ProfileResponse>(
              "/profile/getme",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

          // UPDATED: Log the profileResponse.data object immediately after the request
          console.log("PROFILE RESPONSE");
          console.log(profileResponse.data);

          const profile = profileResponse.data.data;

          // UPDATED: Cleaned up logs to use standard profile print
          console.log("PROFILE");
          console.log(profile);

          // UPDATED: Added log for the structured return user object
          console.log("RETURN USER");
          console.log({
            id: profile.id,
            user_id: profile.user_id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            phone: profile.phone,
            role_name: profile.role_name,
            accessToken,
          });

          return {
            id: profile.id,
            user_id: profile.user_id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            phone: profile.phone,
            role_name: profile.role_name,
            accessToken,
          };
        } catch (error) {
          console.error("Authorize Error:");
          console.error(error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT USER");
      console.log(user);
      if (user) {
        token.id = user.id;
        token.user_id = user.user_id;

        token.first_name = user.first_name;
        token.last_name = user.last_name;

        token.email = user.email;
        token.phone = user.phone;

        token.role_name = user.role_name;

        token.accessToken = user.accessToken;
      }
      
      console.log("JWT TOKEN");
      console.log(token);

      return token;
    },

    async session({ session, token }) {
      console.log("TOKEN");
      console.log(token);

      session.user = {
        ...session.user,

        id: token.id as string,
        user_id: token.user_id as string,
        first_name: token.first_name as string,
        last_name: token.last_name as string,
        email: token.email as string,
        phone: token.phone as string,
        role_name: token.role_name as
          | "ROLE_ADMIN"
          | "ROLE_TECHNICIAN",

        accessToken: token.accessToken as string,
      };

      session.accessToken = token.accessToken as string;

      console.log("SESSION");
      console.log(session);

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};