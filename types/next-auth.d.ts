// types/next-auth.d.ts

import { DefaultUser } from "next-auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;

    user: DefaultUser & {
      id: string;
      user_id: string;

      first_name: string;
      last_name: string;

      phone: string;
      email: string;

      role_name: "ROLE_ADMIN" | "ROLE_TECHNICIAN";

      // IMPORTANT
      accessToken: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    user_id: string;

    first_name: string;
    last_name: string;

    phone: string;
    email: string;

    role_name: "ROLE_ADMIN" | "ROLE_TECHNICIAN";

    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    user_id: string;

    first_name: string;
    last_name: string;

    phone: string;
    email: string;

    role_name: "ROLE_ADMIN" | "ROLE_TECHNICIAN";

    accessToken: string;
  }
}