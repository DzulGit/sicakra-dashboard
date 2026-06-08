"use client";

import React from "react";
import { useRegistration } from "./hooks/useRegistration";
import { RegistrationTable } from "./RegistrationTable";
import { RegistrationDetail } from "./RegistrationDetail";

interface RegistrationsFiturProps {
  initialData: any[];
  role: "SUPER_ADMIN" | "OPERASIONAL" | "KEUANGAN" | "TEKNIS";
  apiProcessFn: (token: string, id: string, dto: any) => Promise<any>;
  onRefresh?: () => void;
}

export function RegistrationsFitur({
  initialData = [],
  role,
  apiProcessFn,
  onRefresh,
}: RegistrationsFiturProps) {
  
  const {
    data,
    selectedReg,
    setSelectedReg,
    isProcessing,
    isRejecting,
    setIsRejecting,
    rejectReason,
    setRejectReason,
    handleProcess,
  } = useRegistration(initialData, onRefresh);

  return (
    <div className="space-y-6">
      {/* Header Judul */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Manajemen Pendaftaran Pelanggan
        </h1>
        <p className="text-sm text-muted-foreground">
          Sistem validasi berkas pendaftar Sicakra WiFi untuk tingkatan hak akses:{" "}
          <span className="font-semibold text-primary uppercase">{role}</span>.
        </p>
      </div>

      {/* 🔄 KEMBALI FULL WIDTH: Tabel mengambil ruang penuh layar */}
      <div className="w-full">
        <RegistrationTable
          data={data}
          selectedRegId={selectedReg?.id || null}
          onSelectRow={setSelectedReg}
        />
      </div>

      {/* 🔄 DRAWER INTERAKTIF: Mengambang di atas konten saat baris diklik */}
      <RegistrationDetail
        selectedReg={selectedReg}
        onClose={() => setSelectedReg(null)} // Menutup drawer saat klik silang / luar
        isProcessing={isProcessing}
        isRejecting={isRejecting}
        setIsRejecting={setIsRejecting}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        onProcess={(status) => handleProcess(status, apiProcessFn)}
      />
    </div>
  );
}