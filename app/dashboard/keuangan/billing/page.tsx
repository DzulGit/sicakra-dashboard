import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FinanceFitur } from "@/components/dashboard/fitur/finance";

// Fungsi penarik data invoice riil yang nembak ke NestJS lu nanti
async function fetchInvoicesData(token: string) {
  try {
    // 📢 SILAKAN GANTI URL SESUAI ENDPOINT KEUANGAN NESTJS LU
    const res = await fetch("http://localhost:3000/invoices", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 } // Data keuangan wajib fresh tanpa cache
    });

    if (!res.ok) throw new Error("Gagal mengambil data tagihan");
    const result = await res.json();
    return Array.isArray(result) ? result : (result.data || []);
  } catch (error) {
    console.error("Error fetch invoices:", error);
    return [];
  }
}

export default async function KeuanganBillingPage() {
  const { getToken, sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as any)?.role || "KEUANGAN";

  // Proteksi halaman level server (Hanya Keuangan, Super Admin, atau Operasional tertentu)
  if (userRole !== "KEUANGAN" && userRole !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const nestjsToken = await getToken({ template: "nestjs" });
  const initialInvoices = await fetchInvoicesData(nestjsToken || "");

  return (
    <main className="w-full">
      <FinanceFitur
        initialData={initialInvoices}
        role={userRole}
      />
    </main>
  );
}