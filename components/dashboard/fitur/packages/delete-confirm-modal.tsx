import React from "react";

export function DeleteConfirmModal({ isOpen, onClose, pkg, onSuccess }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border p-6 rounded-xl max-w-sm shadow-xl text-center animate-in zoom-in-95">
        <h3 className="text-lg font-bold text-foreground">Hapus Paket?</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          Yakin ingin menghapus paket <b>{pkg.name}</b>? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-lg">Batal</button>
          <button className="px-4 py-2 text-sm bg-rose-500 text-white rounded-lg">Hapus Permanen</button>
        </div>
      </div>
    </div>
  );
}