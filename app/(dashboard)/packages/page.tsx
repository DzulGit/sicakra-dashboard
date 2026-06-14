"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { PackagesView } from "@/components/dashboard/fitur/packages/packages-view";
import { canAccess } from "@/lib/permissions"; // Sesuaikan path jika beda
import { AdminRole } from "@/types";

export default function PackagesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    // 1. Ambil role langsung dari Cookie (sama persis dengan cara di layout lu)
    const savedRole = Cookies.get("sicakra_role") as AdminRole;

    if (!savedRole) {
      // Jika tidak ada cookie, arahkan ke login (sesuaikan URL login lu)
      router.push("/login"); 
      return;
    }

    setAdminRole(savedRole);
    setIsLoading(false);

    // 2. Gunakan fungsi sakti canAccess dari permissions.ts lu
    const hasAccess = canAccess(savedRole, "packages");
    if (!hasAccess) {
      // Tendang ke dashboard utama jika TEKNIS mencoba masuk
      router.push("/dashboard"); 
    }
  }, [router]);

  // Loading spinner saat sedang mengecek cookie dan izin akses
  if (isLoading || !adminRole) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  // Jika lolos semua validasi, render halaman Package Pipeline-nya
  return (
    <main className="container mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      <PackagesView role={adminRole} />
    </main>
  );
}