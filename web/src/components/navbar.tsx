"use client";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <h1 className="text-lg font-semibold text-gray-700">
        Welcome to SecureVote
      </h1>
      <div className="flex items-center gap-3">
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
