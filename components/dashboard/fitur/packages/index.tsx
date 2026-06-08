"use client";

import React from "react";
import { Plus } from "lucide-react";
import { usePackage } from "./hooks/usePackage";
import { PackageList } from "./PackageList";
import { PackageModal } from "./PackageModal";

interface PackagesFiturProps {
  initialData: any[];
  role: "SUPER_ADMIN" | "OPERASIONAL" | "KEUANGAN" | "TEKNIS";
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
  
  // Panggil pelayan hook pintar untuk mengelola state paket WiFi
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

  const isSuperAdmin = role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      
      {/* 1. TOP BAR: Judul & Tombol Tambah (Khusus Super Admin) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kelola Paket Internet WiFi
          </h1>
          <p className="text-sm text-muted-foreground">
            Daftar paket layanan internet Sicakra WiFi yang aktif di sistem untuk role:{" "}
            <span className="font-semibold text-primary uppercase">{role}</span>.
          </p>
        </div>

        {/* Tombol Aksi Tambah - Hanya Muncul untuk Super Admin */}
        {isSuperAdmin && (
          <button
            onClick={() => openFormModal(null)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Paket Baru
          </button>
        )}
      </div>

      {/* 2. GRID LIST: Menampilkan paket dalam bentuk Card Grid */}
      <PackageList
        data={initialData.length > 0 ? initialData : packages}
        role={role}
        onEdit={(pkg) => openFormModal(pkg)}
        onToggleStatus={(id, currentStatus) => handleToggleStatus(id, currentStatus, apiToggleFn)}
      />

      {/* 3. MODAL COMPONENT: Pop-up Formulir Tambah / Edit (Hanya untuk Super Admin) */}
      {isSuperAdmin && (
        <PackageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          isEditMode={!!selectedPackage}
          isProcessing={isProcessing}
          onSubmit={() => handleSaveSubmit(apiSaveFn)}
        />
      )}
      
    </div>
  );
}