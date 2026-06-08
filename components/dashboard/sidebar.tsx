"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Settings,
  ClipboardList,
  Wallet,
} from "lucide-react";

// Ambil type role dari cetakan database lu
export type AdminRole = "SUPER_ADMIN" | "OPERASIONAL" | "KEUANGAN" | "TEKNIS";

interface SidebarProps {
  role: AdminRole;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

// ─── 1. DAFTAR SEMUA FITUR GLOBAL & PERMISSION (Ide Brilian Lu) ───
const ALL_FEATURES = [
  {
    id: "registrations",
    label: "Pendaftaran",
    href: "/dashboard/operasional/registrations",
    icon: Users,
    allowedRoles: ["SUPER_ADMIN", "OPERASIONAL"], // Cuma bisa dilihat Super Admin & Operasional
  },
  {
    id: "packages",
    label: "Kelola Paket",
    href: "/dashboard/operasional/packages",
    icon: Package,
    allowedRoles: ["SUPER_ADMIN", "OPERASIONAL", "KEUANGAN"], // Fleksibel untuk 3 role
  },
  {
    id: "billing",
    label: "Tagihan Pelanggan",
    href: "/dashboard/keuangan/billing", // Menuju folder keuangan nanti
    icon: Wallet,
    allowedRoles: ["SUPER_ADMIN", "KEUANGAN"],
  },
  {
    id: "tasks",
    label: "Jadwal Pasang",
    href: "/dashboard/teknis", // Menuju folder teknis nanti
    icon: ClipboardList,
    allowedRoles: ["SUPER_ADMIN", "TEKNIS"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "#",
    icon: Settings,
    allowedRoles: ["SUPER_ADMIN", "OPERASIONAL", "KEUANGAN", "TEKNIS"], // Semua role bisa akses
  },
];

export function Sidebar({
  role = "OPERASIONAL",
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();

  // ─── 2. LOGIKA PILIH OVERVIEW SECARA DINAMIS ──────────────────────
  // Sesuai kesepakatan, overview dipisah per folder role masing-masing
  const overviewMenu = {
    id: "overview",
    label: "Overview",
    href: role === "SUPER_ADMIN" ? "/dashboard/operasional" : `/dashboard/${role.toLowerCase()}`, 
    icon: LayoutDashboard,
  };

  // ─── 3. FILTER FITUR YANG DIIZINKAN UNTUK ROLE INI ───────────────
  const allowedFeatures = ALL_FEATURES.filter((feature) =>
    feature.allowedRoles.includes(role)
  );

  // Gabungkan menu Overview di paling atas, baru diikuti fitur yang lolos filter
  const finalNavItems = [overviewMenu, ...allowedFeatures];

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
        {finalNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {/* Indikator Garis Aktif */}
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
        })}
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