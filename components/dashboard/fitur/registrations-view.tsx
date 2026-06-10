"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { ClipboardList, Search, Check, X, Eye, Loader2 } from "lucide-react";
import { fetchRegistrations, processRegistration, Registration } from "@/lib/registrations";

export function RegistrationsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  // 🔥 Cukup panggil begini aja. Karena di lib/registrations.ts udah pake `credentials: "include"`,
  // browser bakal otomatis ngirim cookie `sicakra_session` ke backend NestJS lu.
  const { data: registrations, error, isLoading, mutate } = useSWR(
    'registrationsList', 
    () => fetchRegistrations() 
  );

  // ⚡ Handler memanggil processRegistration dari lib lu (tanpa token)
  const handleValidate = async (id: string, action: "APPROVED" | "REJECTED") => {
    setActionId(id);
    try {
      const data = action === "REJECTED" 
        ? { status: action, rejectReason: "Persyaratan berkas tidak terpenuhi." }
        : { status: action };
        
      // 🔥 Gak perlu kirim authToken lagi!
      await processRegistration(id, data);
      
      // Refresh UI tanpa reload halaman
      mutate();
    } catch (err) {
      alert("Gagal memproses pendaftaran. Cek console backend.");
    } finally {
      setActionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Sinkronisasi data pendaftaran server...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500 font-medium">
        <span>Gagal terhubung ke sicakra-api. Pastikan server aktif!</span>
      </div>
    );
  }

  const filteredData = (registrations || []).filter(
    (item: Registration) =>
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-accent" />
            <span>Validasi Pendaftaran Pelanggan</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola dan validasi berkas pasang baru Sicakra WiFi dari server utama.
          </p>
        </div>
      </div>

      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama atau ID registrasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-sidebar border border-sidebar-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent"
        />
      </div>

      <div className="bg-sidebar border border-sidebar-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sidebar-border bg-sidebar-accent/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-5 py-3">ID Reg</th>
                <th className="px-5 py-3">Nama Pelanggan</th>
                <th className="px-5 py-3">Kontak & Email</th>
                <th className="px-5 py-3">Alamat Pasang</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi Server</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-sidebar-border text-sidebar-foreground">
              {filteredData.length > 0 ? (
                filteredData.map((row: Registration) => (
                  <tr key={row.id} className="hover:bg-sidebar-accent/20 transition-colors duration-150">
                    <td className="px-5 py-3.5 font-mono font-medium text-accent text-[11px]">{row.id.substring(0, 8)}...</td>
                    <td className="px-5 py-3.5 font-medium">{row.fullName}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <div>{row.phone}</div>
                      <div className="text-[10px] opacity-70">{row.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground max-w-xs truncate">{row.address}, {row.city}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          row.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : row.status === "REJECTED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 hover:bg-sidebar-accent rounded-md text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {row.status === "PENDING" && actionId !== row.id && (
                          <>
                            <button onClick={() => handleValidate(row.id, "APPROVED")} className="p-1.5 hover:bg-emerald-500/10 rounded-md text-muted-foreground hover:text-emerald-400">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleValidate(row.id, "REJECTED")} className="p-1.5 hover:bg-rose-500/10 rounded-md text-muted-foreground hover:text-rose-400">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {actionId === row.id && <Loader2 className="w-4 h-4 animate-spin text-accent mr-1.5" />}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    Tidak ada data pendaftaran aktif.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
