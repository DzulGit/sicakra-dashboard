"use client";

import React from "react";
import { Users, Package, CreditCard, Wrench, CheckCircle2, AlertCircle } from "lucide-react";
// Memanggil MetricCard asli bawaan template lu
import { MetricCard } from "@/components/dashboard/metric-card"; 

interface OverviewViewProps {
  role: "OPERASIONAL" | "KEUANGAN" | "TEKNIS";
}

export function OverviewView({ role }: OverviewViewProps) {
  // Sesuai dengan jenis tipe data dari MetricCardProps lu
  const statsConfig = {
    OPERASIONAL: [
      { title: "Total Pendaftaran", value: "142", icon: Users, change: "+12%", changeType: "positive" as const },
      { title: "Paket Aktif", value: "18", icon: Package, change: "0%", changeType: "neutral" as const },
      { title: "Menunggu Validasi", value: "5", icon: AlertCircle, change: "-2%", changeType: "negative" as const },
    ],
    KEUANGAN: [
      { title: "Tagihan Bulan Ini", value: "Rp 42.500.000", icon: CreditCard, change: "+85%", changeType: "positive" as const },
      { title: "Belum Membayar", value: "24 Pelanggan", icon: AlertCircle, change: "+5%", changeType: "negative" as const },
      { title: "Invoice Lunas", value: "118 Terbayar", icon: CheckCircle2, change: "+10%", changeType: "positive" as const },
    ],
    TEKNIS: [
      { title: "Tugas Lapangan", value: "14 Lokasi", icon: Wrench, change: "+3 tugas", changeType: "positive" as const },
      { title: "Selesai Hari Ini", value: "9 Kerja", icon: CheckCircle2, change: "+2 kerja", changeType: "positive" as const },
      { title: "Pending / Gangguan", value: "5 Tiket", icon: AlertCircle, change: "-1 tiket", changeType: "negative" as const },
    ],
  };

  const currentStats = statsConfig[role] || statsConfig.OPERASIONAL;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Selamat Datang Kembali di Sicakra
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Berikut adalah ringkasan aktivitas dan metrik utama untuk divisi <span className="text-accent font-medium lowercase">{role}</span>.
        </p>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentStats.map((stat, idx) => (
          <MetricCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType} // 🔥 Sekarang nilainya pas ("positive" | "negative" | "neutral")
            delay={idx}                  // Efek animasi delay bawaan template lu
          />
        ))}
      </div>

      {/* Recent Activity Card */}
      <div className="bg-sidebar border border-sidebar-border p-5 rounded-xl">
        <h3 className="text-sm font-semibold text-sidebar-foreground mb-4">Log Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
            <div>
              <p className="text-sidebar-foreground font-medium">Konektivitas sistem utama stabil</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Barusan • Sesi enkripsi diperbarui</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}