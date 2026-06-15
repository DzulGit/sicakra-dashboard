"use client";

import React, { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { PackageIcon, Plus, Loader2, Search, Filter } from "lucide-react";
import { AdminRole } from "@/types";
import { fetchPackages, Package } from "@/lib/packages";
import { PackageCard } from "./package-card";
import { PackageFormModal } from "./package-form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";

interface PackagesViewProps {
  role: AdminRole;
}

// 🔥 BATASI 3 ITEM AJA biar pas 1 baris dan gak ada scroll ke bawah
const ITEMS_PER_PAGE = 3;

export function PackagesView({ role }: PackagesViewProps) {
  const canModify = role === "OPERASIONAL";

  // 🔥 Fungsi 'mutate' ini yang narik data ulang dari DB tanpa harus refresh browser!
  const { data: packages, error, isLoading, mutate } = useSWR("packagesList", fetchPackages);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPackages = useMemo(() => {
    if (!packages) return [];
    return packages.filter((pkg) => {
      const matchSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === "ALL" ? true : pkg.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [packages, searchQuery, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE) || 1;
  const currentData = filteredPackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreate = () => { setSelectedPkg(null); setIsFormOpen(true); };
  const handleEdit = (pkg: Package) => { setSelectedPkg(pkg); setIsFormOpen(true); };
  const handleDeleteClick = (pkg: Package) => { setSelectedPkg(pkg); setIsDeleteOpen(true); };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-sm font-medium">Memuat data layanan...</span>
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

  return (
    // 🔥 KUNCI SCROLLING: h-[calc(100vh-120px)] dan overflow-hidden biar nempel kaku di layar
    <div className="space-y-5 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-110px)] overflow-hidden">

      {/* HEADER - Dibuat shrink-0 biar gak kegencet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-accent" />
            <span>Master Layanan Paket WiFi</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola, filter, dan pantau ketersediaan paket internet Sicakra.
          </p>
        </div>

        {canModify && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Buat Paket Baru
          </button>
        )}
      </div>

      {/* TOOLBAR: SEARCH & FILTER - shrink-0 */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 border border-border rounded-xl shadow-sm shrink-0">
        <div className="relative w-full sm:max-w-md flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama paket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex w-full sm:w-auto p-1 bg-background border border-border rounded-lg">
          {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filterStatus === status
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
            >
              {status === "ALL" ? "Semua Paket" : status === "ACTIVE" ? "Active" : "Arsip"}
            </button>
          ))}
        </div>
      </div>

      {/* KONTEN GRID KARTU (Fleksibel ngisi sisa ruang tanpa bikin scroll body) */}
      <div className="flex-1 overflow-hidden">
        {currentData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {currentData.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                index={index}
                canModify={canModify}
                onEdit={() => handleEdit(pkg)}
                onDelete={() => handleDeleteClick(pkg)}
                onSuccess={() => mutate()}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl text-muted-foreground">
            <Filter className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">Tidak ada data paket yang cocok.</p>
          </div>
        )}
      </div>

      {/* FOOTER PAGINATION (Sesuai Referensi Gambar) */}
      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto shrink-0 text-sm text-muted-foreground">
        <div>
          Showing <span className="font-medium text-foreground">{currentData.length}</span> of <span className="font-medium text-foreground">{filteredPackages.length}</span> paket
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors font-medium"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md transition-colors font-medium ${currentPage === page
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors font-medium"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS */}
      {isFormOpen && (
        <PackageFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialData={selectedPkg}
          // 🔥 Pas form sukses disave, mutate() dipanggil biar data baru langsung muncul!
          onSuccess={() => { mutate(); setIsFormOpen(false); }}
        />
      )}
      {isDeleteOpen && selectedPkg && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          pkg={selectedPkg}
          // 🔥 Sama, pas sukses hapus, panggil mutate()
          onSuccess={() => { mutate(); setIsDeleteOpen(false); }}
        />
      )}
    </div>
  );
}