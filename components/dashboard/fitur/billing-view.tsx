"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Wallet, Search, CheckCircle2, Clock, Loader2, DollarSign } from "lucide-react";
import { fetchInvoices, payInvoice, Invoice } from "@/lib/invoices";

export function BillingView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🔥 Tarik data real-time pake SWR
  const { data: invoices, error, isLoading, mutate } = useSWR(
    'invoicesList',
    () => fetchInvoices()
  );

  // ⚡ Aksi untuk mengubah status jadi LUNAS
  const handlePayment = async (id: string) => {
    if (!confirm("Yakin ingin menandai tagihan ini sebagai LUNAS?")) return;
    
    setLoadingId(id);
    const success = await payInvoice(id);
    if (success) {
      mutate(); // Refresh tabel seketika
    } else {
      alert("Gagal memproses pembayaran. Cek log backend lu bos!");
    }
    setLoadingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Memuat data tagihan pelanggan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500 font-medium">
        <span>Gagal terhubung ke server. Pastikan NestJS lu jalan!</span>
      </div>
    );
  }

  // Filter pencarian berdasarkan nama, no invoice, atau periode
  const filteredData = (invoices || []).filter((item: Invoice) => {
    const search = searchQuery.toLowerCase();
    return (
      item.invoiceNum.toLowerCase().includes(search) ||
      item.period.toLowerCase().includes(search) ||
      (item.user?.fullName || "").toLowerCase().includes(search)
    );
  });

  // Hitung total uang
  const totalOmset = filteredData.filter((i: Invoice) => i.status === "LUNAS").reduce((acc: number, curr: Invoice) => acc + curr.amount, 0);
  const totalTunggakan = filteredData.filter((i: Invoice) => i.status === "BELUM_DIBAYAR").reduce((acc: number, curr: Invoice) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Stats Cepat */}
      <div className="flex flex-col md:flex-row justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-accent" />
            <span>Manajemen Tagihan (Billing)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pantau dan kelola pembayaran iuran bulanan pelanggan Sicakra.
          </p>
        </div>

        {/* Kotak Rekap Keuangan */}
        <div className="flex gap-4">
          <div className="bg-sidebar border border-sidebar-border px-4 py-2 rounded-lg flex flex-col justify-center shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Diterima</span>
            <span className="text-sm font-extrabold text-emerald-400">Rp {totalOmset.toLocaleString("id-ID")}</span>
          </div>
          <div className="bg-sidebar border border-sidebar-border px-4 py-2 rounded-lg flex flex-col justify-center shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Tunggakan</span>
            <span className="text-sm font-extrabold text-rose-400">Rp {totalTunggakan.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Bar Pencarian */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Cari No Invoice atau Nama..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-sidebar border border-sidebar-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent"
        />
      </div>

      {/* Tabel Tagihan Barbar */}
      <div className="bg-sidebar border border-sidebar-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sidebar-border bg-sidebar-accent/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-5 py-3">No. Invoice</th>
                <th className="px-5 py-3">Pelanggan</th>
                <th className="px-5 py-3">Periode</th>
                <th className="px-5 py-3">Nominal Tagihan</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-sidebar-border text-sidebar-foreground">
              {filteredData.length > 0 ? (
                filteredData.map((row: Invoice) => (
                  <tr key={row.id} className="hover:bg-sidebar-accent/20 transition-colors duration-150">
                    <td className="px-5 py-3.5 font-mono font-bold text-accent text-[11px]">{row.invoiceNum}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-foreground">{row.user?.fullName || "Anonim"}</div>
                      <div className="text-[10px] text-muted-foreground">{row.user?.phone}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium">{row.period}</td>
                    <td className="px-5 py-3.5 font-bold">Rp {row.amount.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3.5">
                      {row.status === "LUNAS" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> LUNAS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <Clock className="w-3 h-3" /> BELUM DIBAYAR
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {row.status === "BELUM_DIBAYAR" ? (
                        <button 
                          onClick={() => handlePayment(row.id)}
                          disabled={loadingId === row.id}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md font-bold text-[10px] flex items-center gap-1.5 ml-auto transition-colors disabled:opacity-50"
                        >
                          {loadingId === row.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                          PROSES LUNAS
                        </button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-medium">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    Belum ada data tagihan.
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