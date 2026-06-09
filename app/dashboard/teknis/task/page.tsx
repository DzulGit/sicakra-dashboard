import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TeknisFitur } from "@/components/dashboard/fitur/teknis";

// Fungsi narik data tugas teknisi
async function fetchTasksData(token: string) {
  try {
    // 💡 Asumsi: lu filter dari backend buat narik yang ASSIGNED aja
    const res = await fetch("http://localhost:3000/registrations", {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    
    const data = await res.json();
    // 🔥 SOLUSI ERROR MAP: Pastikan selalu return Array!
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error("Gagal tarik data teknis:", error);
    return [];
  }
}

export default async function TeknisTasksPage() {
  const { getToken, sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as any)?.role;

  // Satpam Role Teknis
  //if (userRole !== "TEKNIS" && userRole !== "SUPER_ADMIN" && userRole !== "OPERASIONAL") {
  //  redirect("/login");
  //}

  const nestjsToken = await getToken({ template: "nestjs" });
  
  // Tarik data pendaftaran
  const allRegistrations = await fetchTasksData(nestjsToken || "");
  
  // Kita saring khusus yang statusnya udah 'ASSIGNED' biar masuk kerjaan teknis
  const tasks = allRegistrations.filter((item: any) => item.status === "ASSIGNED");

  return (
    <main className="w-full">
      {/* Cukup lempar data tasks-nya aja, gak usah lempar Server Action */}
      <TeknisFitur initialTasks={tasks} />
    </main>
  );
}