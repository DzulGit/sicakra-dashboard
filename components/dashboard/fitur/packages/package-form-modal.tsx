import React, { useState, useEffect } from "react";
import { X, Save, Zap, Loader2, Info } from "lucide-react";
import { Package } from "@/lib/packages";

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Package | null;
  onSuccess: () => void;
}

export function PackageFormModal({ isOpen, onClose, initialData, onSuccess }: PackageFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    speedDown: "",
    speedUp: "",
    features: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        speedDown: initialData.speedDown.toString(),
        speedUp: initialData.speedUp.toString(),
        features: initialData.features?.join(", ") || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        price: parseInt(formData.price) || 0,
        speedDown: parseInt(formData.speedDown) || 0,
        speedUp: parseInt(formData.speedUp) || 0,
        status: initialData ? initialData.status : "ACTIVE",
        features: formData.features ? formData.features.split(',').map((f) => f.trim()).filter(Boolean) : []
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://sicakra-api-qgjaoib32q-et.a.run.app";
      const endpoint = initialData ? `${apiUrl}/packages/${initialData.id}` : `${apiUrl}/packages`;
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");
      onSuccess();
    } catch (error: any) {
      alert(error.message);
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-sidebar/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {initialData ? "Edit Konfigurasi Paket" : "Tambah Paket Baru"}
              </h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Internal System Sicakra WiFi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-secondary hover:text-rose-500 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="packageForm" onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto min-h-0">
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Nama Layanan Paket <span className="text-rose-500">*</span>
            </label>
            <input required name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Sicakra Business Pro - 50 Mbps"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-medium" />
          </div>

          {/* 🔥 SEKARANG HARGA MAKAN FULL COLUMN (Lebih lega & proporsional) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Harga Bulanan (IDR) <span className="text-rose-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Rp</span>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="500000"
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-all font-semibold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                Download <span className="text-emerald-500">(Mbps)</span>
              </label>
              <input required type="number" name="speedDown" value={formData.speedDown} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-all font-mono" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                Upload <span className="text-blue-500">(Mbps)</span>
              </label>
              <input required type="number" name="speedUp" value={formData.speedUp} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-all font-mono" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Fitur Unggulan</label>
            <textarea name="features" value={formData.features} onChange={handleChange} rows={2} placeholder="Unlimited, Public IP, SLA 99.9%"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-all resize-none" />
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground italic mt-0.5">
              <Info className="w-3 h-3 text-accent" />
              <span>Gunakan koma sebagai pemisah antar fitur.</span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border bg-sidebar/50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-xs font-bold border border-border rounded-xl hover:bg-secondary transition-colors uppercase tracking-widest">
            Batal
          </button>
          <button type="submit" form="packageForm" disabled={isSubmitting} className="px-6 py-2 text-xs font-bold bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all flex items-center gap-2 shadow-lg shadow-accent/20 uppercase tracking-widest">
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isSubmitting ? "Saving..." : "Simpan Paket"}
          </button>
        </div>
      </div>
    </div>
  );
}