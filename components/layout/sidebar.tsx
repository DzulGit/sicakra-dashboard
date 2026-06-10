"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Wifi, ChevronLeft, ChevronRight } from "lucide-react";
import { getNavForRole } from "@/lib/nav-items"; 
import { AdminRole } from "@/types"; 

interface SidebarProps {
  role: AdminRole;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({
  role = "OPERASIONAL",
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();

  // 🔥 FIX SAKTI: Paksa string role dari cookie backend menjadi uppercase biar sinkron dengan allowedRoles
  const normalizedRole = (role?.toUpperCase() || "OPERASIONAL") as AdminRole;
  const finalNavItems = getNavForRole(normalizedRole);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
            <Wifi className="w-5 h-5 text-primary" />
          </div>
          <span
            className={cn(
              "font-semibold text-lg text-sidebar-foreground whitespace-nowrap transition-all duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            Sicakra WiFi
          </span>
        </div>
      </div>

      {/* Dynamic Navigation Container */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {finalNavItems && finalNavItems.length > 0 ? (
          finalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-200",
                    isActive ? "text-accent" : "group-hover:scale-110"
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-300",
                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })
        ) : (
          <div className="text-center text-[10px] text-muted-foreground pt-4">
            Menu tidak tersedia
          </div>
        )}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}