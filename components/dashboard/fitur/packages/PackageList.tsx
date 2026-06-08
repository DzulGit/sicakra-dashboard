"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Wifi, Edit, Power, PowerOff, Check } from "lucide-react";

interface PackageListProps {
  data: any[];
  role: string;
  onEdit: (pkg: any) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export function PackageList({
  data = [],
  role,
  onEdit,
  onToggleStatus,
}: PackageListProps) {

  return (
    <div className="w-full">
      {data.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card text-muted-foreground">
          <p className="font-medium">Belum ada paket WiFi tersedia.</p>
          <p className="text-xs text-muted-foreground/80 mt-1">Silakan tambahkan paket internet baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((pkg: any) => {
            const isActive = pkg.status === "ACTIVE";

            return (
              <div
                key={pkg.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md",
                  isActive 
                    ? "border-border" 
                    : "border-rose-100 bg-rose-50/10 opacity-75 grayscale-[30%]"
                )}
              >
                {/* Status Badge */}
                <span
                  className={cn(
                    "absolute top-4 right-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-rose-50 text-rose-600 border-rose-200"
                  )}
                >
                  {pkg.status}
                </span>

                {/* Konten Atas: Nama & Fitur */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      isActive ? "bg-primary/10 text-primary" : "bg-rose-100 text-rose-500"
                    )}>
                      <Wifi className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground tracking-tight">{pkg.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        🚀 Up: {pkg.speedUp} Mbps | Down: {pkg.speedDown} Mbps
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-2xl font-extrabold text-foreground">
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium"> / bulan</span>
                  </div>

                  {pkg.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pkg.description}
                    </p>
                  )}

                  <div className="border-t border-border pt-4 space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fitur Paket:</p>
                    <ul className="space-y-2">
                      {pkg.features && pkg.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/90">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 🔓 SEKAT DIHAPUS: Semua tombol aksi keluar bebas untuk siapa saja */}
                <div className="border-t border-border mt-6 pt-4 flex gap-3">
                  {/* Tombol Status */}
                  <button
                    onClick={() => onToggleStatus(pkg.id, pkg.status)}
                    className={cn(
                      "p-2.5 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-1.5 flex-1",
                      isActive
                        ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    )}
                  >
                    {isActive ? (
                      <>
                        <PowerOff className="w-4 h-4" />
                        <span className="text-xs">Matikan</span>
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4" />
                        <span className="text-xs">Aktifkan</span>
                      </>
                    )}
                  </button>

                  {/* Tombol Edit */}
                  <button
                    onClick={() => onEdit(pkg)}
                    className="p-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5 flex-1"
                  >
                    <Edit className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold">Edit Paket</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}