"use client";

import React from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    name: string;
    description: string;
    price: number;
    speedDown: number;
    speedUp: number;
    features: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  isProcessing: boolean;
  isEditMode: boolean;
}

export function PackageModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isProcessing,
  isEditMode,
}: PackageModalProps) {
  
  if (!isOpen) return null;

  // Handler untuk mengubah isi teks fitur spesifik berdasarkan index array
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData((prev: any) => ({ ...prev, features: updatedFeatures }));
  };

  // Handler untuk menambah baris input fitur baru di paling bawah
  const addFeatureRow = () => {
    setFormData((prev: any) => ({ ...prev, features: [...prev.features, ""] }));
  };

  // Handler untuk menghapus satu baris input fitur tertentu
  const removeFeatureRow = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev: any) => ({ ...prev, features: updatedFeatures }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-lg flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-lg font-bold text-foreground">
            {isEditMode ? "⚙️ Edit Paket Internet" : "✨ Tambah Paket Baru"}
          </h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable jika input panjang) */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Input Nama Paket */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Nama Paket *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
              placeholder="Contoh: Sicakra Home Family"
              className="w-full text-sm p-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Grid Harga & Kecepatan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Harga Bulanan (Rp) *</label>
              <input
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="150000"
                className="w-full text-sm p-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Download (Mbps)</label>
              <input
                type="number"
                value={formData.speedDown}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, speedDown: Number(e.target.value) }))}
                className="w-full text-sm p-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Upload (Mbps)</label>
              <input
                type="number"
                value={formData.speedUp}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, speedUp: Number(e.target.value) }))}
                className="w-full text-sm p-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Deskripsi Paket */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Deskripsi Singkat</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
              placeholder="Tulis ringkasan target atau keunggulan paket di sini..."
              className="w-full text-sm p-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[70px]"
            />
          </div>

          {/* Bagian Keunggulan / Fitur Dinamis */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Fasilitas / Keunggulan Paket</label>
              <button
                type="button"
                onClick={addFeatureRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Baris
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder={`Keunggulan ${idx + 1} (Misal: Bebas FUP / Kuota Tanpa Batas)`}
                    className="flex-1 text-sm p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureRow(idx)}
                      className="p-2 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Modal Action */}
        <div className="border-t border-border pt-4 flex gap-3 justify-end">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onSubmit}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Buat Paket"}
          </button>
        </div>

      </div>
    </div>
  );
}