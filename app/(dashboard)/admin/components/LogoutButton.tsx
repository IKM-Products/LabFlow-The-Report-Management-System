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
      className="w-full justify-start gap-3 h-11 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-semibold text-sm transition-colors group"
    >
      <LogOut className="h-4 w-4 text-neutral-400 group-hover:text-rose-400 transition-colors" />
      Log Out
    </Button>
  );
}