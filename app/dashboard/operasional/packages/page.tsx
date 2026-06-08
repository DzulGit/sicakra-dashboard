import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PackagesFitur } from "@/components/dashboard/fitur/packages";

// Contoh dummy fungsi server action (Ganti dengan nembak fetch/axios asli lu nanti)
async function serverSavePackage(token: string, id: string | null, payload: any) {
  "use server";
  console.log("Menyimpan paket dari server. ID:", id, "Payload:", payload);
  return { success: true };
}

async function serverTogglePackageStatus(token: string, id: string, payload: any) {
  "use server";
  console.log("Mengubah status paket ID:", id, "Payload:", payload);
  return { success: true };
}

async function fetchPackagesData(token: string) {
  try {
    // 📢 SILAKAN GANTI URL DI BAWAH INI SESUAI ENDPOINT NESTJS LU
    const res = await fetch("http://localhost:3000/packages", {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      next: { revalidate: 30 } // Cache selama 30 detik karena data paket jarang berubah
    });
    
    if (!res.ok) throw new Error("Gagal mengambil data paket");
    
    const result = await res.json();
    return Array.isArray(result) ? result : (result.data || []);
  } catch (error) {
    console.error("Gagal fetch packages:", error);
    return [];
  }
}

export default async function OperasionalPackagesPage() {
  const { getToken, sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as any)?.role || "OPERASIONAL";
  
  const nestjsToken = await getToken({ template: "nestjs" });
  
  // Ambil data paket riil dari server
  const initialPackages = await fetchPackagesData(nestjsToken || "");

  return (
    <main className="w-full">
      <PackagesFitur
        initialData={initialPackages} // 👈 Masukkan variabel data riil ke sini
        role={userRole}
        apiSaveFn={serverSavePackage}
        apiToggleFn={serverTogglePackageStatus}
      />
    </main>
  );
}