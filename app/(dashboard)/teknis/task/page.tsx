import React from "react";
import { cookies } from 'next/headers'
import { TeknisFitur } from "@/components/dashboard/fitur/teknis";

// Fungsi narik data tugas teknisi
async function fetchTasksData(sessionToken: string) {
  try {
    // 💡 Asumsi: lu filter dari backend buat narik yang ASSIGNED aja
    const res = await fetch("http://localhost:3000/registrations", {
      headers: { 
        "Content-Type": "application/json",
        Cookie: `sicakra_session=${sessionToken}`
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
  const cookieStore = await cookies();
  const session = cookieStore.get('sicakra_session')?.value;
  const userRole = (cookieStore.get('sicakra_role')?.value || 'teknis').toUpperCase();

  if (!session) {
    return (
      <main className="w-full">
        <div className="p-6">Unauthorized</div>
      </main>
    );
  }

  // Tarik data pendaftaran
  const allRegistrations = await fetchTasksData(session);
  
  // Kita saring khusus yang statusnya udah 'ASSIGNED' biar masuk kerjaan teknis
  const tasks = allRegistrations.filter((item: any) => item.status === "ASSIGNED");

  return (
    <main className="w-full">
      {/* Cukup lempar data tasks-nya aja, gak usah lempar Server Action */}
      <TeknisFitur initialTasks={tasks} />
    </main>
  );
}