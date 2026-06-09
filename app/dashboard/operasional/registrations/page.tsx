"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegistrationsFitur } from "@/components/dashboard/fitur/registrations";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs"; // 👈 Ambil token resmi Clerk dari sini

export default function OperasionalRegistrationsPage() {
  const router = useRouter();
  const { getToken, isLoaded: isAuthLoaded } = useAuth() as any; // Hook resmi Clerk
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("OPERASIONAL");
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!isAuthLoaded) return; // Tunggu sampai session Clerk siap di browser

      try {
        const adminRaw = localStorage.getItem("sicakra_admin");
        
        // 🔥 AMBIL TOKEN NESTJS ASLI DARI SESI CLERK YANG SUDAH KITA LOGIN-IN TADI
        const token = await getToken({ template: "nestjs" }); 
        
        if (!adminRaw || !token) {
          console.log("Sesi kosong, silakan login ulang.");
          router.push("/login");
          return;
        }

        const admin = JSON.parse(adminRaw);
        setRole(admin.role || "OPERASIONAL");

        // Tembak API NestJS menggunakan Token Clerk yang diakui Satpam Backend
        const res = await fetch("http://localhost:3000/registrations", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(`Backend nolak dengan Status HTTP: ${res.status}`);
        }

        const result = await res.json();
        const finalData = result && result.data ? result.data : (Array.isArray(result) ? result : []);
        setRegistrations(finalData);

      } catch (error: any) {
        console.error("❌ Error detail:", error);
        setDebugError(error.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthLoaded, router, getToken]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Memuat data pendaftaran...</span>
      </div>
    );
  }

  if (debugError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-2 bg-destructive/5 p-4 text-center">
        <div className="text-destructive font-semibold text-lg">⚠️ Pengambilan Data Gagal</div>
        <div className="text-sm text-muted-foreground max-w-md bg-background border border-destructive/20 p-3 rounded-lg font-mono">
          {debugError}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 h-9 bg-foreground text-background text-sm font-medium rounded hover:opacity-90 transition-opacity"
        >
          Coba Muat Ulang Halaman
        </button>
      </div>
    );
  }

  return (
    <main className="w-full">
      <RegistrationsFitur initialData={registrations} role={role} />
    </main>
  );
}