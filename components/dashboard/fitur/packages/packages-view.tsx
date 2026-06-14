"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { PackageIcon, Plus, Loader2 } from "lucide-react";
import { AdminRole } from "@/types";
import { fetchPackages, Package } from "@/lib/packages";
import { PackageBoard } from "./package-board";
import { PackageFormModal } from "./package-form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";

interface PackagesViewProps {
  role: AdminRole;
}

export function PackagesView({ role }: PackagesViewProps) {
  const canModify = role === "OPERASIONAL";
  const { data: packages, error, isLoading, mutate } = useSWR("packagesList", fetchPackages);

  // State untuk Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  // Handlers
  const handleCreate = () => {
    setSelectedPkg(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pkg: Package) => {
    setSelectedPkg(pkg);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (pkg: Package) => {
    setSelectedPkg(pkg);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-sm font-medium">Memuat pipeline layanan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20">
        <span className="font-medium">Gagal mengambil data dari server.</span>
      </div>
    );
  }

  // Mengelompokkan data ke dalam "Stages" ala Pipeline
  const activePackages = packages?.filter((p) => p.status === "ACTIVE") || [];
  const inactivePackages = packages?.filter((p) => p.status === "INACTIVE") || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Ala Pipeline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-accent" />
            <span>Master Layanan Paket WiFi</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola dan pantau ketersediaan paket internet dalam bentuk pipeline.
          </p>
        </div>

        {canModify && (
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Buat Paket Baru
          </button>
        )}
      </div>

      {/* Papan Pipeline (Board) */}
      <PackageBoard 
        activePackages={activePackages} 
        inactivePackages={inactivePackages}
        canModify={canModify}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCreate={handleCreate}
      />

      {/* Modals Container */}
      {isFormOpen && (
        <PackageFormModal 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          initialData={selectedPkg}
          onSuccess={() => mutate()} // Refresh SWR setelah sukses simpan
        />
      )}

      {isDeleteOpen && selectedPkg && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          pkg={selectedPkg}
          onSuccess={() => mutate()} // Refresh SWR setelah sukses hapus
        />
      )}
    </div>
  );
}