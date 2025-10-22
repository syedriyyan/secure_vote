"use client";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-white">
      <div className="flex items-center gap-2">
        <span className="md:hidden">
          <SidebarTrigger />
        </span>
        <h1 className="text-base sm:text-lg font-semibold text-gray-700">
          Welcome to SecureVote
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
