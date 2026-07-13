import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Manually extract the token payload container directly from the encrypted cookies framework
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // --- NATIVE SYSTEM LOGGING ---
  console.log("=========================================");
  console.log(`[MIDDLEWARE ACTIVE] Intercepted Path: ${path}`);
  console.log(`[TOKEN PRESENT]: ${!!token}`);
  if (token) {
    console.log(`[TOKEN DATA]: role=${token.role}, email=${token.email}`);
  }
  console.log("=========================================");

  // 1. Unauthenticated Wall: If they try to hit protected areas without a token, bounce them to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Normalize the user's role string
  const userRole = token.role ? String(token.role).toLowerCase().replace("role_", "").trim() : "";

  // 2. Strict Admin Route Validation Lock
  if (path.startsWith("/admin")) {
    if (userRole !== "admin") {
      console.warn(`[SECURITY INTERCEPT] Blocked ${userRole} from entering /admin`);
      return NextResponse.redirect(new URL("/login?error=AccessDeniedAdmin", req.url));
    }
  }

  // 3. Strict Technician Route Validation Lock
  if (path.startsWith("/technician")) {
    if (userRole !== "technician") {
      console.warn(`[SECURITY INTERCEPT] Blocked ${userRole} from entering /technician`);
      return NextResponse.redirect(new URL("/login?error=AccessDeniedTechnician", req.url));
    }
  }

  return NextResponse.next();
}

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