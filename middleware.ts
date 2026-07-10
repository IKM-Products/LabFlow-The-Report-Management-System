import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Extract user role from NextAuth JWT payload (ensure you expose this in your [...nextauth] callbacks configuration)
    const userRole = token?.role; // "admin" | "technician"

    // Role-based authorization path restrictions
    if (path.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/technician") && userRole !== "technician") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      // Ensures the route mapping only processes when a valid JWT session payload exists
      authorized: ({ token }) => !!token?.accessToken,
    },
  }
);

// Route parameters configuration matcher tracking all functional system segments
export const config = { 
  matcher: [
    "/admin/:path*",
    "/technician/:path*",
    "/dashboard/:path*",
    "/patients/:path*",
    "/orders/:path*",
    "/results/:path*",
    "/catalog/:path*"
  ] 
};