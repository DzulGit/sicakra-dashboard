import { LayoutDashboard, Users, Package, Wallet, Wrench, SettingsIcon, Inbox } from "lucide-react";
import { AdminRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  allowedRoles: string[];
}

const ALL_NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/overview",
    icon: LayoutDashboard,
    allowedRoles: ["OPERASIONAL", "KEUANGAN", "TEKNIS"],
  },
  {
    label: "Pendaftaran",
    href: "/registrations",
    icon: Users,
    allowedRoles: ["OPERASIONAL"],
  },
  {
    label: "Pengajuan Layanan",
    href: "/requests",
    icon: Inbox,
    allowedRoles: ["OPERASIONAL"],
  },
  {
    label: "Kelola Paket",
    href: "/packages",
    icon: Package,
    allowedRoles: ["OPERASIONAL", "KEUANGAN"],
  },
  {
    label: "Tagihan Pelanggan",
    href: "/billing",
    icon: Wallet,
    allowedRoles: ["KEUANGAN"],
  },
  {
    label: "Tugas Lapangan",
    href: "/tasks",
    icon: Wrench,
    allowedRoles: ["TEKNIS"], 
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    allowedRoles: ["OPERASIONAL", "KEUANGAN", "TEKNIS"],
  },
];

export function getNavForRole(role: string): NavItem[] {
  const cleanRole = role?.toUpperCase();
  return ALL_NAV_ITEMS.filter((item) => item.allowedRoles.includes(cleanRole));
}