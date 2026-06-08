"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Send, CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react";

interface InvoiceTableProps {
  data: any[];
  getOverdueStatus: (dueDate: string, status: string) => any;
  onSendReminder: (invoice: any) => void;
}

export function InvoiceTable({
  data = [],
  getOverdueStatus,
  onSendReminder,
}: InvoiceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING">("ALL");

  // 1. Filter Data Berdasarkan Input Pencarian & Pilihan Status
  const filteredData = data.filter((invoice: any) => {
    const customerName = (invoice.user?.fullName || invoice.customerName || "").toLowerCase();
    const matchesSearch = customerName.includes(searchQuery.toLowerCase());
    
    if (statusFilter === "ALL") return matchesSearch;
    return invoice.status === statusFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 w-full">
      {/* 🔍 BARIS ATAS: Fitur Pencarian & Filter Status Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        {/* Input Cari Nama */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama pelanggan nunggak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Pilihan Filter Tab */}
        <div className="flex bg-muted p-1 rounded-lg border border-border shrink-0 self-start sm:self-auto">
          {(["ALL", "PAID", "PENDING"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-md transition-all uppercase tracking-wider",
                statusFilter === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "ALL" ? "Semua" : tab === "PAID" ? "Lunas" : "Belum Bayar"}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 BARIS BAWAH: Main Tabel Monitor Keuangan */}
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-card-foreground">
          <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4">Nama & No. WiFi</th>
              <th className="px-6 py-4">Jumlah Tagihan</th>
              <th className="px-6 py-4">Jatuh Tempo</th>
              <th className="px-6 py-4">Status & Keterangan</th>
              <th className="px-6 py-4 text-right">Aksi Xendit / WA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground bg-muted/10">
                  Tidak ada rekaman tagihan yang cocok dengan filter saat ini.
                </td>
              </tr>
            ) : (
              filteredData.map((invoice: any) => {
                // Ambil kalkulasi status kedaruratan warna dari hook
                const overdue = getOverdueStatus(invoice.dueDate, invoice.status);

                return (
                  <tr
                    key={invoice.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    {/* Profil Pelanggan */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-foreground font-semibold">
                          {invoice.user?.fullName || invoice.customerName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {invoice.user?.wifiId || invoice.invoiceNumber || invoice.id.slice(0, 8)}
                        </span>
                      </div>
                    </td>

                    {/* Nominal Duit */}
                    <td className="px-6 py-4 font-bold text-foreground">
                      Rp {(invoice.amount || 0).toLocaleString("id-ID")}
                    </td>

                    {/* Tanggal Jatuh Tempo */}
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>

                    {/* 🎨 WARNA GRADASI GRADUAL (Kuning / Orange / Merah) */}
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider",
                          overdue.className
                        )}
                      >
                        {invoice.status === "PAID" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : overdue.level === "CLEAN" ? (
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
                        )}
                        {overdue.text}
                      </span>
                    </td>

                    {/* Tombol Cek invoice Xendit / Colek via WhatsApp */}
                    <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                      {/* Link Invoice Xendit */}
                      {invoice.paymentUrl && (
                        <a
                          href={invoice.paymentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                          title="Buka Link Invoice Xendit"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {/* Tombol Ping WhatsApp (Hanya muncul jika BELUM BAYAR) */}
                      {invoice.status !== "PAID" && (
                        <button
                          onClick={() => onSendReminder(invoice)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all border",
                            overdue.level === "RED"
                              ? "bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-sm"
                              : "bg-background hover:bg-muted text-foreground border-border"
                          )}
                          title="Kirim Pesan Tagihan Ke WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>{overdue.level === "RED" ? "🚨 Tagih Keras" : "Ingatkan"}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}