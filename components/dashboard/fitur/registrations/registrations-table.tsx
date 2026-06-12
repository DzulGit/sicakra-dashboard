"use client";

import React from "react";
import { Eye, Check, X, Loader2, User, Phone, Mail, MapPin } from "lucide-react";
import { Registration } from "@/lib/registrations";

interface RegistrationsTableProps {
  data: Registration[];
  actionId: string | null;
  onViewDetail: (reg: Registration) => void;
  onValidate: (id: string, action: "APPROVED" | "REJECTED") => void;
}

export function RegistrationsTable({ data, actionId, onViewDetail, onValidate }: RegistrationsTableProps) {
  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-sidebar-border bg-sidebar-accent/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-3.5">Detail Pelanggan</th>
              <th className="px-6 py-3.5">Kontak & Alamat</th>
              <th className="px-6 py-3.5">Paket Layanan</th>
              <th className="px-6 py-3.5">Status Alur</th>
              <th className="px-6 py-3.5 text-right">Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-sidebar-border text-sidebar-foreground">
            {data.length > 0 ? (
              data.map((row: Registration) => (
                <tr key={row.id} className="hover:bg-sidebar-accent/10 transition-colors duration-150">
                  
                  {/* Pelanggan */}
                  <td className="px-6 py-4 space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="capitalize">{row.fullName}</span>
                    </div>
                    <div className="text-[10px] font-mono text-accent bg-accent/5 inline-block px-1.5 py-0.5 rounded border border-accent/10">
                      ID: {row.id.substring(0, 8).toUpperCase()}
                    </div>
                  </td>

                  {/* Kontak & Alamat */}
                  <td className="px-6 py-4 space-y-1 text-muted-foreground">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3 text-emerald-500" /> {row.phone}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] truncate max-w-[160px]">
                      <Mail className="w-3 h-3 text-amber-500" /> {row.email}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] opacity-80 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 text-rose-500" /> {row.address}, {row.city}
                    </div>
                  </td>

                  {/* Paket */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground text-[11px]">
                      {row.package?.name || "Layanan Custom"}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {row.package?.price ? `Rp ${row.package.price.toLocaleString("id-ID")}/bln` : "-"}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${
                      row.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : row.status === "REJECTED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {row.status}
                    </span>
                  </td>

                  {/* Tombol-tombol Aksi */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onViewDetail(row)}
                        title="Buka Berkas Detail"
                        className="p-1.5 bg-sidebar-accent/50 hover:bg-sidebar-accent border border-sidebar-border rounded-md text-muted-foreground hover:text-foreground transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {row.status === "PENDING" && actionId !== row.id && (
                        <>
                          <button 
                            onClick={() => onValidate(row.id, "APPROVED")}
                            title="Setujui & Jadwalkan"
                            className="p-1.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/30 rounded-md text-emerald-500 transition-all"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onValidate(row.id, "REJECTED")}
                            title="Tolak Berkas"
                            className="p-1.5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 rounded-md text-rose-500 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {actionId === row.id && (
                        <div className="p-1.5">
                          <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-medium">
                  Tidak ditemukan data pendaftaran aktif.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}