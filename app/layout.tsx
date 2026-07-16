import type { Metadata } from "next";
import "./globals.css";

import SessionAuthProvider from "@/providers/session-provider";

export const metadata: Metadata = {
  title: "LabFlow",
  description: "Laboratory Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionAuthProvider>
          {children}
        </SessionAuthProvider>
      </body>
    </html>
  );
}