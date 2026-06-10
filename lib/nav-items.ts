import { LayoutDashboard, Users, Package, Wallet, Settings } from "lucide-react";
import { AdminRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
}

const ALL_NAV_ITEMS = [
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
];

export function getNavForRole(role: AdminRole): NavItem[] {
  // Paksa role menjadi uppercase sewaktu pencocokan array
  const cleanRole = role?.toUpperCase();
  return ALL_NAV_ITEMS.filter((item) => item.allowedRoles.includes(cleanRole));
}