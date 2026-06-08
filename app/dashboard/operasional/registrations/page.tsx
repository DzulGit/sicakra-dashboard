import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RegistrationsFitur } from "@/components/dashboard/fitur/registrations";

// 💡 TIPS: Import fungsi hit API internal frontend lu di sini
// Contoh: import { getRegistrations, processRegistration } from "@/lib/api";

// Fungsi dummy untuk simulasi fetching data di sisi server (Ganti dengan fungsi API lu yang asli nanti)
async function fetchRegistrationsData(token: string) {
  try {
    // Di sini lu bisa nembak langsung ke endpoint NestJS lu, misal:
    // const res = await fetch("http://localhost:3000/registrations", {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return res.json();
    
    return []; // Sementara di-return array kosong jika belum disambungkan ke fetch asli
  } catch (error) {
    console.error("Gagal mengambil data di server:", error);
    return [];
  }
}

// Fungsi dummy untuk proses aksi (Ganti dengan fungsi processRegistration asli lu)
async function serverProcessRegistration(token: string, id: string, dto: any) {
  "use server"; // Menandakan ini adalah Server Action aman
  
  // Di sini nanti isinya logic nembak axios/fetch PATCH/POST ke NestJS lu
  console.log("Memproses pendaftaran dari server untuk ID:", id, dto);
  
  // Return mock response agar tidak error pas di-test tombolnya
  return {
    success: true,
    data: { accessToken: "ABC123" } // Simulasi token voucher dari backend
  };
}

export default async function OperasionalRegistrationsPage() {
  // 1. KUNCI KEAMANAN: Ambil session claims langsung dari token Clerk di server
  const { sessionClaims, getToken } = await auth();
  
  // Ambil data role yang disimpan di metadata Clerk saat login
  const userRole = (sessionClaims?.metadata as any)?.role || "OPERASIONAL"; 

  // 2. BLOKIR USER: Jika yang masuk bukan Operasional atau Super Admin, langsung tendang!
  if (userRole !== "OPERASIONAL" && userRole !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // 3. FETCH DATA AWAL: Ambil token JWT NestJS untuk narik data pendaftar dari server
  const nestjsToken = await getToken({ template: "nestjs" });
  const initialData = await fetchRegistrationsData(nestjsToken || "");

  return (
    <main className="w-full">
      {/* 4. RENDERING: Panggil komponen fitur utuh yang udah kita rakit pintar */}
      <RegistrationsFitur
        initialData={initialData}
        role={userRole}
        apiProcessFn={serverProcessRegistration}
        // onRefresh bisa diisi router.refresh() jika ingin memperbarui data server component
      />
    </main>
  );
}