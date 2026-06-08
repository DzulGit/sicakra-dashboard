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
  
  // Minta bantuan hook pintar untuk mengelola seluruh status dan logic WhatsApp
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
      {/* 1. Header Judul Fitur */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Manajemen Pendaftaran Pelanggan
        </h1>
        <p className="text-sm text-muted-foreground">
          Sistem validasi berkas pendaftar Sicakra WiFi untuk tingkatan hak akses:{" "}
          <span className="font-semibold text-primary uppercase">{role}</span>.
        </p>
      </div>

      {/* 2. Grid Layout Responsive (Kiri Tabel, Kanan Panel Detail) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        
        {/* Kolom Tabel Pelanggan (Makan area 2/3 layar lebar) */}
        <div className="lg:col-span-2">
          <RegistrationTable
            data={data}
            selectedRegId={selectedReg?.id || null}
            onSelectRow={setSelectedReg}
          />
        </div>

        {/* Kolom Detail & Panel Aksi WhatsApp (Makan area 1/3 layar kanan) */}
        <div className="lg:col-span-1">
          <RegistrationDetail
            selectedReg={selectedReg}
            isProcessing={isProcessing}
            isRejecting={isRejecting}
            setIsRejecting={setIsRejecting}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            onProcess={(status) => handleProcess(status, apiProcessFn)}
          />
        </div>
        
      </div>
    </div>
  );
}