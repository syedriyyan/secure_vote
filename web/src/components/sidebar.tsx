"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Vote, BarChart, Settings } from "lucide-react";

export function Sidebar() {
  const path = usePathname();
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/elections", label: "Elections", icon: Vote },
    { href: "/results", label: "Results", icon: BarChart },
    { href: "/profile", label: "Profile", icon: Settings },
  ];

  return (
    <aside className="w-60 border-r bg-white shadow-sm h-screen sticky top-0">
      <div className="px-4 py-6 text-xl font-semibold text-primary">
        SecureVote
      </div>
      <nav className="space-y-1 px-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
              path === href
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
