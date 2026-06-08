"use client";

import React from "react";
import { Plus } from "lucide-react";
import { usePackage } from "./hooks/usePackage";
import { PackageList } from "./PackageList";
import { PackageModal } from "./PackageModal";

interface PackagesFiturProps {
  initialData: any[];
  role: string;
  apiSaveFn: (token: string, id: string | null, payload: any) => Promise<any>;
  apiToggleFn: (token: string, id: string, payload: any) => Promise<any>;
  onRefresh?: () => void;
}

export function PackagesFitur({
  initialData = [],
  role,
  apiSaveFn,
  apiToggleFn,
  onRefresh,
}: PackagesFiturProps) {
  
  const {
    packages,
    selectedPackage,
    isModalOpen,
    setIsModalOpen,
    isProcessing,
    formData,
    setFormData,
    openFormModal,
    handleSaveSubmit,
    handleToggleStatus,
  } = usePackage(initialData, onRefresh);

  return (
    <div className="space-y-6">
      
      {/* TOP BAR: Judul & Tombol Tambah (Sekarang Terbuka untuk Semua Akses) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kelola Paket Internet WiFi
          </h1>
          <p className="text-sm text-muted-foreground">
            Daftar paket layanan internet Sicakra WiFi yang aktif di sistem.
          </p>
        </div>

        {/* 🔓 SEKAT DIHAPUS: Tombol tambah langsung muncul tanpa filter role */}
        <button
          onClick={() => openFormModal(null)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Paket Baru
        </button>
      </div>

      {/* GRID LIST CARD */}
      <PackageList
        data={initialData.length > 0 ? initialData : packages}
        role={role}
        onEdit={(pkg) => openFormModal(pkg)}
        onToggleStatus={(id, currentStatus) => handleToggleStatus(id, currentStatus, apiToggleFn)}
      />

      {/* 🔓 SEKAT DIHAPUS: Modal Form siap melayani siapa saja */}
      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        isEditMode={!!selectedPackage}
        isProcessing={isProcessing}
        onSubmit={() => handleSaveSubmit(apiSaveFn)}
      />
      
    </div>
  );
}