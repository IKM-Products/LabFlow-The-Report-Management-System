if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_API_BASE_URL");
}

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};