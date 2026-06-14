// package-form-modal.tsx (Contoh Struktur Dasar)
import React from "react";
import { Package } from "@/lib/packages";

export function PackageFormModal({ isOpen, onClose, initialData, onSuccess }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border p-6 rounded-xl w-full max-w-lg shadow-xl animate-in zoom-in-95">
        <h3 className="text-lg font-bold mb-4">{initialData ? "Edit Paket" : "Buat Paket Baru"}</h3>
        {/* Masukkan form lu di sini (Input Name, Price, Speed, Features, Status) */}
        <p className="text-sm text-muted-foreground mb-6">Form input dikembangkan di sini bang...</p>
        
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-lg">Batal</button>
          <button className="px-4 py-2 text-sm bg-accent text-accent-foreground rounded-lg">Simpan</button>
        </div>
      </div>
    </div>
  );
}

