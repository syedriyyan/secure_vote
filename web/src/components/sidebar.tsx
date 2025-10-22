"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Vote, BarChart, Settings } from "lucide-react";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function Sidebar() {
  const path = usePathname();
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/elections", label: "Elections", icon: Vote },
    { href: "/dashboard/results", label: "Results", icon: BarChart },
    { href: "/dashboard/profile", label: "Profile", icon: Settings },
  ];

  return (
    <UISidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-4">
        <span className="text-xl font-semibold">SecureVote</span>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {links.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={path === href}>
                  <Link href={href} className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </UISidebar>
  );
}
