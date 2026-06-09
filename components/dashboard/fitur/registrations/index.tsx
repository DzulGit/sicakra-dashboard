"use client";

import React, { useState } from "react";
import { Search, MapPin, Phone, CalendarClock, ShieldAlert, CheckCircle } from "lucide-react";
import { AssignTaskModal } from "./AssignTaskModal";
import { useAuth } from "@clerk/nextjs"; // 👈 1. IMPORT CLERK DI SINI

export function RegistrationsFitur({ initialData = [], role }: any) {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 👈 2. PANGGIL FUNGSI GET TOKEN DARI HOOK CLERK
  const { getToken } = useAuth(); 

  // State Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);

  // Filter Data
  const filteredData = data.filter((item: any) => 
    item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phone?.includes(searchQuery)
  );

  const handleAssignTask = async (id: string, payload: { surveyDate: string; surveyTime: string }) => {
    try {
      // 👈 3. GENERATE TOKEN VIP DULU SEBELUM MENCET API
      const token = await getToken({ template: "nestjs" });

      const response = await fetch(`http://localhost:3000/registrations/${id}/assign`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 👈 4. SERAHKAN TOKENNYA KE SATPAM NESTJS
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal menjadwalkan teknisi");

      // Update UI lokal
      setData((prev: any[]) =>
        prev.map((item) => (item.id === id ? { ...item, status: "ASSIGNED", ...payload } : item))
      );
      
      alert("Berhasil! Tugas sudah masuk ke layar Tim Teknis.");
      return true;
    } catch (error) {
      console.error(error);
      alert("Gagal memproses. Cek koneksi server NestJS.");
      return false;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Antrian Pendaftaran
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola calon pelanggan baru, negosiasi jadwal, dan tugaskan tim teknis.
          </p>
        </div>
        
        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama / nomor HP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border px-9 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors rounded-lg"
          />
        </div>
      </div>

      {/* TABLE / CARD LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card text-muted-foreground">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium">Tidak ada data pendaftaran.</p>
          </div>
        ) : (
          filteredData.map((item: any) => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all gap-4">
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base text-foreground tracking-tight">{item.fullName}</h3>
                  {item.status === "PENDING" && (
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Menunggu Jadwal</span>
                  )}
                  {item.status === "ASSIGNED" && (
                    <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Dijadwalkan</span>
                  )}
                  {item.status === "COMPLETED" && (
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Selesai Pasang</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground font-medium">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{item.address}, Kel. {item.village}, Kec. {item.district}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>WA: {item.phone}</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-border/60 pt-4 sm:pt-0 sm:pl-5 gap-2">
                <a
                  href={`https://wa.me/62${item.phone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> Hubungi WA
                </a>

                {item.status === "PENDING" && (
                  <button
                    onClick={() => {
                      setSelectedRegistration(item);
                      setIsAssignModalOpen(true);
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <CalendarClock className="w-3.5 h-3.5" /> Atur Jadwal
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL PENJADWALAN */}
      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        registrationData={selectedRegistration}
        onAssignSubmit={handleAssignTask}
      />
    </div>
  );
}