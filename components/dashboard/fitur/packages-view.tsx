"use client";

import React from "react";
import { Package, Plus, Wifi, Edit3, Trash2, Users } from "lucide-react";
import { AdminRole } from "@/types";

interface PackagesViewProps {
  role: AdminRole;
}

export function PackagesView({ role }: PackagesViewProps) {
  // Cek apakah user punya hak untuk memodifikasi data paket
  const canModify = role === "OPERASIONAL";

  // Data Dummy Master Paket WiFi Sicakra
  const dummyPackages = [
    { id: "PKG-01", name: "Sicakra Home", speed: "20 Mbps", price: "Rp 150.000", activeUsers: 84 },
    { id: "PKG-02", name: "Sicakra Gamers", speed: "50 Mbps", price: "Rp 275.000", activeUsers: 42 },
    { id: "PKG-03", name: "Sicakra Business", speed: "100 Mbps", price: "Rp 500.000", activeUsers: 16 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Utama Fitur */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            <span>Master Layanan Paket WiFi</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar paket internet aktif yang tersedia di dalam ekosistem Sicakra WiFi.
          </p>
        </div>

        {/* Tombol Tambah cuma muncul untuk divisi Operasional (RBAC Control) */}
        {canModify && (
          <button className="h-9 px-4 bg-primary text-primary-foreground font-medium rounded-lg text-xs flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Buat Paket Baru</span>
          </button>
        )}
      </div>

      {/* Grid Kartu Paket Modern */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyPackages.map((pkg) => (
          <div 
            key={pkg.id} 
            className="group relative bg-sidebar border border-sidebar-border p-5 rounded-xl flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-sm"
          >
            <div>
              {/* Atas Card */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors duration-300">
                  <Wifi className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono bg-sidebar-accent px-2 py-0.5 rounded border border-sidebar-border text-muted-foreground">
                  {pkg.id}
                </span>
              </div>

              {/* Info Kecepatan & Nama */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-sidebar-foreground">{pkg.name}</h3>
                <p className="text-2xl font-extrabold text-foreground tracking-tight pt-1">{pkg.price}<span className="text-xs font-normal text-muted-foreground">/bulan</span></p>
                <p className="text-xs text-muted-foreground pt-2">🚀 Alokasi Bandwidth: <span className="text-foreground font-medium">{pkg.speed}</span></p>
              </div>
            </div>

            {/* Bagian Bawah Card */}
            <div className="mt-6 pt-4 border-t border-sidebar-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{pkg.activeUsers} Pelanggan aktif</span>
              </div>

              {/* Aksi Modifikasi cuma bisa diakses oleh Operasional */}
              {canModify && (
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-sidebar-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Edit Paket">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-rose-500/10 rounded-md text-muted-foreground hover:text-rose-400 transition-colors" title="Hapus Paket">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}