"use client";

import React, { useState } from "react";
import { CreditCard, Search, Printer, CheckCircle, Receipt } from "lucide-react";

export function BillingView() {
  const [searchQuery, setSearchQuery] = useState("");

  // Data Dummy Invoice Tagihan WiFi Sicakra
  const dummyInvoices = [
    { id: "INV-2026-001", name: "Zulal Hafizh", package: "Sicakra Home - 20 Mbps", amount: "Rp 150.000", status: "LUNAS", dueDate: "2026-06-05" },
    { id: "INV-2026-002", name: "Budi Santoso", package: "Sicakra Gamers - 50 Mbps", amount: "Rp 275.000", status: "BELUM BAYAR", dueDate: "2026-06-15" },
    { id: "INV-2026-003", name: "Ahmad Subarjo", package: "Sicakra Business - 100 Mbps", amount: "Rp 500.000", status: "JATUH TEMPO", dueDate: "2026-06-01" },
  ];

  // Filter pencarian berdasarkan nama atau nomor Invoice
  const filteredInvoices = dummyInvoices.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Utama Fitur */}
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-accent" />
          <span>Manajemen Tagihan & Invoice</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pantau status pembayaran, konfirmasi setoran, dan cetak invoice bulanan pelanggan.
        </p>
      </div>

      {/* Ringkasan Kecil Finansial (Mini Widgets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-sidebar border border-sidebar-border rounded-xl flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Omset Bulan Ini</p>
            <p className="text-lg font-bold text-foreground mt-0.5">Rp 42.500.000</p>
          </div>
        </div>
        <div className="p-4 bg-sidebar border border-sidebar-border rounded-xl flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Belum Terbayar</p>
            <p className="text-lg font-bold text-foreground mt-0.5">24 Pelanggan</p>
          </div>
        </div>
      </div>

      {/* Bar Pencarian */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama atau nomor invoice..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-sidebar border border-sidebar-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
        />
      </div>

      {/* Tabel Invoice Elegan */}
      <div className="bg-sidebar border border-sidebar-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sidebar-border bg-sidebar-accent/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-5 py-3">No. Invoice</th>
                <th className="px-5 py-3">Nama Pelanggan</th>
                <th className="px-5 py-3">Paket WiFi</th>
                <th className="px-5 py-3">Jumlah Tagihan</th>
                <th className="px-5 py-3">Jatuh Tempo</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-sidebar-border text-sidebar-foreground">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-sidebar-accent/20 transition-colors duration-150">
                    <td className="px-5 py-3.5 font-mono font-medium text-accent">{invoice.id}</td>
                    <td className="px-5 py-3.5 font-medium">{invoice.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{invoice.package}</td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">{invoice.amount}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{invoice.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          invoice.status === "LUNAS"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : invoice.status === "JATUH TEMPO"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 hover:bg-sidebar-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Cetak Nota/Invoice">
                          <Printer className="w-4 h-4" />
                        </button>
                        {invoice.status !== "LUNAS" && (
                          <button className="p-1.5 hover:bg-emerald-500/10 rounded-md text-muted-foreground hover:text-emerald-400 transition-colors" title="Konfirmasi Lunas">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    Tidak ada data invoice yang cocok.
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