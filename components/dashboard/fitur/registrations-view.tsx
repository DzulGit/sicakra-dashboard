"use client";

import React, { useState } from "react";
import { ClipboardList, Search, Check, X, Eye } from "lucide-react";

export function RegistrationsView() {
  const [searchQuery, setSearchQuery] = useState("");

  // Data Dummy Pendaftaran Sicakra WiFi
  const dummyRegistrations = [
    { id: "REG-001", name: "Zulal Hafizh", package: "Sicakra Home - 20 Mbps", address: "Sleman, Yogyakarta", status: "PENDING", date: "2026-06-10" },
    { id: "REG-002", name: "Budi Santoso", package: "Sicakra Gamers - 50 Mbps", address: "Bantul, Yogyakarta", status: "APPROVED", date: "2026-06-09" },
    { id: "REG-003", name: "Siti Rahma", package: "Sicakra Business - 100 Mbps", address: "Kota Yogyakarta", status: "REJECTED", date: "2026-06-08" },
  ];

  // Filter pencarian berdasarkan nama atau ID
  const filteredData = dummyRegistrations.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Utama Fitur */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-accent" />
            <span>Validasi Pendaftaran Pelanggan</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola dan validasi berkas pendaftaran pasang baru Sicakra WiFi.
          </p>
        </div>
      </div>

      {/* Bar Pencarian & Filter cepat */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama atau ID registrasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-sidebar border border-sidebar-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
        />
      </div>

      {/* Tabel Data Modern & Elegan */}
      <div className="bg-sidebar border border-sidebar-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sidebar-border bg-sidebar-accent/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-5 py-3">ID Reg</th>
                <th className="px-5 py-3">Nama Pelanggan</th>
                <th className="px-5 py-3">Paket Layanan</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-sidebar-border text-sidebar-foreground">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-sidebar-accent/20 transition-colors duration-150">
                    <td className="px-5 py-3.5 font-mono font-medium text-accent">{row.id}</td>
                    <td className="px-5 py-3.5 font-medium">{row.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{row.package}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{row.date}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          row.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : row.status === "REJECTED"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 hover:bg-sidebar-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Lihat Berkas">
                          <Eye className="w-4 h-4" />
                        </button>
                        {row.status === "PENDING" && (
                          <>
                            <button className="p-1.5 hover:bg-emerald-500/10 rounded-md text-muted-foreground hover:text-emerald-400 transition-colors" title="Setujui">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-rose-500/10 rounded-md text-muted-foreground hover:text-rose-400 transition-colors" title="Tolak">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    Tidak ada data pendaftaran yang cocok.
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