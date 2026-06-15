import React, { useState } from "react";
import { Loader2, Archive } from "lucide-react";
import { Package } from "@/lib/packages";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: Package;
  onSuccess: () => void;
}

export function DeleteConfirmModal({ isOpen, onClose, pkg, onSuccess }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://sicakra-api-qgjaoib32q-et.a.run.app";
      
      // Nembak jalur @Delete(':id') di backend yang berfungsi untuk nge-set status jadi INACTIVE
      const response = await fetch(`${apiUrl}/packages/${pkg.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengarsipkan paket di server");
      }

      console.log(`✅ Paket ${pkg.name} berhasil diarsipkan!`);
      onSuccess(); 
    } catch (error: any) {
      console.error("❌ Eror API Archive:", error);
      alert(`Gagal mengarsipkan: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-card border border-border p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
            <Archive className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Arsipkan Paket Ini?</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Paket <span className="font-bold text-foreground">{pkg.name}</span> akan disembunyikan dari daftar pendaftaran. Data tidak dihapus permanen untuk menjaga histori tagihan pelanggan lama.
          </p>
          
          <div className="flex justify-center gap-3 w-full">
            <button onClick={onClose} disabled={isDeleting} className="flex-1 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors">
              Batal
            </button>
            <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-2.5 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-sm">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isDeleting ? "Mengarsipkan..." : "Arsipkan Paket"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}