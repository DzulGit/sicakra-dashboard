import { LayoutDashboard, Users, Package, Wallet, Wrench } from "lucide-react";
import { AdminRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  allowedRoles: string[]; // Pakai string[] biar gampang match-nya
}

const ALL_NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/overview",
    icon: LayoutDashboard,
    allowedRoles: ["SUPER_ADMIN", "OPERASIONAL", "KEUANGAN", "TEKNIS"],
  },
  {
    label: "Pendaftaran",
    href: "/registrations",
    icon: Users,
    allowedRoles: ["SUPER_ADMIN", "OPERASIONAL"],
  },
  {
    label: "Kelola Paket",
    href: "/packages",
    icon: Package,
    allowedRoles: ["SUPER_ADMIN", "OPERASIONAL", "KEUANGAN"],
  },
  {
    label: "Tagihan Pelanggan",
    href: "/billing",
    icon: Wallet,
    allowedRoles: ["SUPER_ADMIN", "KEUANGAN"],
  },
  // 🔥 INI DIA MENU YANG NGUMPET
  {
    label: "Tiket Gangguan",
    href: "/tickets",
    icon: Wrench,
    allowedRoles: ["SUPER_ADMIN", "TEKNIS"], 
  },
];

export function getNavForRole(role: string): NavItem[] {
  const cleanRole = role?.toUpperCase();
  return ALL_NAV_ITEMS.filter((item) => item.allowedRoles.includes(cleanRole));
}