"use client";

import React from "react";
import useSWR from "swr";
import { Package as PackageIcon, Plus, Wifi, Edit3, Trash2, Users, Loader2 } from "lucide-react";
import { AdminRole } from "@/types";
import { fetchPackages, Package } from "@/lib/packages"; // 🔥 Import fungsi asli lu

interface PackagesViewProps {
  role: AdminRole;
}


export function PackagesView({ role }: PackagesViewProps) {
  const canModify = role === "OPERASIONAL";
  
  // 🔥 Gabungin SWR sama fungsi fetch lu biar datanya auto-refresh!
  const { data: packages, error, isLoading } = useSWR("packagesList", fetchPackages);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Memuat data paket...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500">
        <span>Gagal mengambil data dari server.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-accent" />
            <span>Master Layanan Paket WiFi</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar paket internet aktif yang tersedia di dalam ekosistem Sicakra WiFi.
          </p>
        </div>

        {canModify && (
          <button className="h-9 px-4 bg-primary text-primary-foreground font-medium rounded-lg text-xs flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Buat Paket Baru</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages && packages.length > 0 ? (
          packages.map((pkg: Package) => (
            <div key={pkg.id} className="group relative bg-sidebar border border-sidebar-border p-5 rounded-xl flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors duration-300">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    pkg.status === "ACTIVE" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-sidebar-accent text-muted-foreground border-sidebar-border"
                  }`}>
                    {pkg.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-sidebar-foreground">{pkg.name}</h3>
                  <p className="text-2xl font-extrabold text-foreground tracking-tight pt-1">
                    Rp {pkg.price.toLocaleString("id-ID")}
                    <span className="text-xs font-normal text-muted-foreground">/bulan</span>
                  </p>
                  <p className="text-xs text-muted-foreground pt-2">
                    🚀 Down: <span className="text-foreground font-medium">{pkg.speedDown} Mbps</span> | Up: <span className="text-foreground font-medium">{pkg.speedUp} Mbps</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-sidebar-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>Pelanggan aktif</span>
                </div>

                {canModify && (
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-sidebar-accent rounded-md text-muted-foreground hover:text-foreground transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-rose-500/10 rounded-md text-muted-foreground hover:text-rose-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10 bg-sidebar border border-sidebar-border rounded-xl">
            <p className="text-sm text-sidebar-foreground font-medium">Belum ada paket data</p>
          </div>
        )}
      </div>
    </div>
  );
}