"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      variant="ghost" 
      className="w-full justify-start gap-3 h-11 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-semibold text-sm transition-colors duration-200"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}