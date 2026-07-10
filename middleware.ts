import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Direct guard condition validating role identity markers
    if (path.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      // Ensures the route mapping only processes matching criteria when a valid JWT payload structure exists
      authorized: ({ token }) => !!token?.accessToken,
    },
  }
);

// Route parameters configuration matcher arrays tracking features
export const config = { 
  matcher: [
    "/dashboard/:path*",
    "/patients/:path*",
    "/orders/:path*",
    "/results/:path*",
    "/catalog/:path*"
  ] 
};