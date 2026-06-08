"use client";

import React from "react";
import { useFinance } from "./hooks/useFinance";
import { InvoiceTable } from "./InvoiceTable";
import { DollarSign, CheckCircle2, AlertTriangle } from "lucide-react";

interface FinanceFiturProps {
  initialData: any[];
  role: string;
  onRefresh?: () => void;
}

export function FinanceFitur({
  initialData = [],
  role,
  onRefresh,
}: FinanceFiturProps) {
  
  // Panggil pelayan hook pintar khusus sirkulasi duit Xendit
  const {
    invoices,
    getOverdueStatus,
    sendWhatsAppReminder
  } = useFinance(initialData, onRefresh);

  // 🧠 HITUNG KAS DINAMIS: Angka statistik otomatis menyesuaikan data riil NestJS
  const totalInvoiced = invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalPaid = invoices.filter(inv => inv.status === "PAID").reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalPending = invoices.filter(inv => inv.status !== "PAID").reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER HALAMAN */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sirkulasi Tagihan & Kas (Xendit)
        </h1>
        <p className="text-sm text-muted-foreground">
          Pemantauan transaksi realtime, otomatisasi perpanjangan paket, dan penagihan bertahap Sicakra WiFi.
        </p>
      </div>

      {/* 2. THREE-CARDS FINANCIAL STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Omset Tagihan */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tagihan</p>
            <p className="text-xl font-extrabold text-foreground">Rp {totalInvoiced.toLocaleString("id-ID")}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Duit Masuk (Lunas) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kas Masuk (Lunas)</p>
            <p className="text-xl font-extrabold text-emerald-500">Rp {totalPaid.toLocaleString("id-ID")}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Duit Mandek (Nunggak) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Piutang (Belum Bayar)</p>
            <p className="text-xl font-extrabold text-amber-500">Rp {totalPending.toLocaleString("id-ID")}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. MAIN TABLE MONITOR */}
      <div className="w-full">
        <InvoiceTable
          data={invoices}
          getOverdueStatus={getOverdueStatus}
          onSendReminder={sendWhatsAppReminder}
        />
      </div>

    </div>
  );
}