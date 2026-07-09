interface DecodedToken {
  exp: number; // Expiration timestamp epoch metric
  sub: string;
  role: string;
  [key: string]: any;
}

/**
 * Safely parses base64 standard string streams back into JSON components without crashing client engines.
 */
export function decodeJwt(token: string): DecodedToken | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to extract structural JWT parameters:", error);
    return null;
  }
}

/**
 * Verifies if a given authorization token sequence string has structurally outlived its expiration timeline window.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Verifies if a user role profile matrix has permission matching role target definitions.
 */
export function hasRequiredRole(userRole: string | undefined, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  return allowedRoles.map(r => r.toLowerCase()).includes(userRole.toLowerCase());
}