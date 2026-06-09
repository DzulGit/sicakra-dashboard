import React from "react";
import { cookies } from 'next/headers'
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

async function fetchPackagesData(sessionToken: string) {
  try {
    // 📢 SILAKAN GANTI URL DI BAWAH INI SESUAI ENDPOINT NESTJS LU
    const res = await fetch("http://localhost:3000/packages", {
      headers: {
        "Content-Type": "application/json",
        Cookie: `sicakra_session=${sessionToken}`,
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
  const cookieStore = await cookies();
  const session = cookieStore.get('sicakra_session')?.value;
  const userRole = (cookieStore.get('sicakra_role')?.value || 'operasional').toUpperCase();

  if (!session) {
    // middleware should handle redirects; return empty dataset
    return (
      <main className="w-full">
        <div className="p-6">Unauthorized</div>
      </main>
    );
  }

  // Ambil data paket riil dari server
  const initialPackages = await fetchPackagesData(session);

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