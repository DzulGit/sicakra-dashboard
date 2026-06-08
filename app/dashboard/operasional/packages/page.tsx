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

export default async function OperasionalPackagesPage() {
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as any)?.role || "OPERASIONAL";

  // Proteksi halaman level server
  if (userRole !== "OPERASIONAL" && userRole !== "SUPER_ADMIN" && userRole !== "KEUANGAN") {
    redirect("/login");
  }

  return (
    <main className="w-full">
      <PackagesFitur
        initialData={[]} // Oper data paket asli hasil fetch database lu di sini
        role={userRole}
        apiSaveFn={serverSavePackage}
        apiToggleFn={serverTogglePackageStatus}
      />
    </main>
  );
}