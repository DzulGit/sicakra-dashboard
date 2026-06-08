"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RegistrationTableProps {
  data: any[];
  selectedRegId: string | null;
  onSelectRow: (registration: any) => void;
}

export function RegistrationTable({
  data, // 👈 Data mentah dari props
  selectedRegId,
  onSelectRow,
}: RegistrationTableProps) {
  
  const tableData = Array.isArray(data) ? data : (data as any)?.data || [];
  
  // Fungsi pembantu untuk mewarnai Badge Status secara dinamis
  const getStatusBadge = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full border-collapse text-left text-sm text-card-foreground">
        <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
          <tr>
            <th className="px-6 py-4">Nama Pelanggan</th>
            <th className="px-6 py-4">Nomor WhatsApp</th>
            <th className="px-6 py-4">Paket WiFi</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Tanggal Daftar</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                Tidak ada data pendaftaran pelanggan saat ini.
              </td>
            </tr>
          ) : (
            tableData.map((reg: any) => {
              const isSelected = selectedRegId === reg.id;
              
              return (
                <tr
                  key={reg.id}
                  className={cn(
                    "transition-colors hover:bg-muted/30 cursor-pointer",
                    isSelected && "bg-muted/60 hover:bg-muted/60"
                  )}
                  onClick={() => onSelectRow(reg)}
                >
                  {/* Nama Lengkap & Email */}
                  <td className="px-6 py-4 font-medium">
                    <div className="flex flex-col">
                      <span className="text-foreground font-semibold">{reg.fullName}</span>
                      <span className="text-xs text-muted-foreground">{reg.email}</span>
                    </div>
                  </td>
                  
                  {/* Nomor WhatsApp */}
                  <td className="px-6 py-4 text-muted-foreground">
                    {reg.phone}
                  </td>
                  
                  {/* Nama Paket WiFi */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">
                      {reg.package?.name || reg.packageName || "Paket tidak diketahui"}
                    </span>
                  </td>
                  
                  {/* Badge Status */}
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider",
                        getStatusBadge(reg.status)
                      )}
                    >
                      {reg.status}
                    </span>
                  </td>
                  
                  {/* Tanggal Terdaftar */}
                  <td className="px-6 py-4 text-muted-foreground">
                    {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }) : "-"}
                  </td>
                  
                  {/* Tombol trigger detail */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah double klik baris
                        onSelectRow(reg);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border border-border transition-all duration-200",
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background hover:bg-muted text-foreground"
                      )}
                    >
                      {isSelected ? "Sedang Dilihat" : "Detail"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}