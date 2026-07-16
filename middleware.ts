import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // ------------------------------------------------------------------
    // If logged in, don't allow access to auth pages
    // ------------------------------------------------------------------
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/forgot-password")
    ) {
      if (token) {
        if (token.role_name === "ROLE_ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        if (token.role_name === "ROLE_TECHNICIAN") {
          return NextResponse.redirect(
            new URL("/technician/dashboard", req.url)
          );
        }
      }
    }

    // ------------------------------------------------------------------
    // Admin Routes
    // ------------------------------------------------------------------
    if (pathname.startsWith("/admin")) {
      if (token?.role_name !== "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }

    // ------------------------------------------------------------------
    // Technician Routes
    // ------------------------------------------------------------------
    if (pathname.startsWith("/technician")) {
      if (token?.role_name !== "ROLE_TECHNICIAN") {
        return NextResponse.redirect(new URL("/forbidden", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public Routes
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup") ||
          pathname.startsWith("/forgot-password")
        ) {
          return true;
        }

        // Protected Routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - api
     * - _next
     * - favicon
     * - images
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};