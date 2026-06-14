"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { PackagesView } from "@/components/dashboard/fitur/packages/packages-view";
import { canAccess } from "@/lib/permissions";
import { AdminRole } from "@/types";

export default function PackagesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // 🔥 Samakan persis dengan layout.tsx: Kasih default 'OPERASIONAL'
  const [adminRole, setAdminRole] = useState<AdminRole>("OPERASIONAL");

  useEffect(() => {
    // 1. Ambil dari cookie. Kalau kosong, pakaikan default 'OPERASIONAL'
    const savedRole = Cookies.get("sicakra_role") as AdminRole;
    const currentRole = savedRole || "OPERASIONAL";

    // 2. Cek akses pake permissions.ts lu
    const hasAccess = canAccess(currentRole, "packages");
    if (!hasAccess) {
      // Tendang ke halaman root ('/') aja biar gak 404
      router.push("/"); 
      return;
    }

    // 3. Lolos!
    setAdminRole(currentRole);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      <PackagesView role={adminRole} />
    </main>
  );
}