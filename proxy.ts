// proxy.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Normalize role string from possible JWT token properties (handles ROLE_ADMIN, ADMIN, etc.)
    const rawRole = (
      token?.userType ||
      token?.role ||
      token?.userRole ||
      (token?.user as { role?: string })?.role ||
      ""
    ).toString().toUpperCase();

    const isAdmin = rawRole.includes("ADMIN");

    // Restrict access to admin routes if the user is not an admin
    if (pathname.startsWith("/dashboard/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard/technician", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};