"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RegistrationDetailProps {
  selectedReg: any | null;
  isProcessing: boolean;
  isRejecting: boolean;
  setIsRejecting: (val: boolean) => void;
  rejectReason: string;
  setRejectReason: (val: string) => void;
  onProcess: (status: "APPROVED" | "REJECTED") => void;
}

export function RegistrationDetail({
  selectedReg,
  isProcessing,
  isRejecting,
  setIsRejecting,
  rejectReason,
  setRejectReason,
  onProcess,
}: RegistrationDetailProps) {
  
  // Jika tidak ada data yang dipilih, tampilkan placeholder kosong yang estetik
  if (!selectedReg) {
    return (
      <div className="hidden lg:flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center text-muted-foreground">
        <p className="font-medium">Belum Ada Data Dipilih</p>
        <p className="text-xs text-muted-foreground/80 mt-1">Silakan klik salah satu baris pendaftar untuk melihat detail.</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header Panel */}
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-bold text-foreground">Detail Pendaftaran</h3>
        <p className="text-xs text-muted-foreground">ID Registrasi: {selectedReg.id}</p>
      </div>

      {/* Konten Scrollable */}
      <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
        {/* Section 1: Biodata */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Data Pelanggan</h4>
          <div className="space-y-2 rounded-lg bg-muted/40 p-3 text-sm">
            <p><strong className="text-muted-foreground">Nama:</strong> <span className="text-foreground font-medium">{selectedReg.fullName}</span></p>
            <p><strong className="text-muted-foreground">WhatsApp:</strong> <span className="text-foreground font-medium">{selectedReg.phone}</span></p>
            <p><strong className="text-muted-foreground">Email:</strong> <span className="text-foreground font-medium">{selectedReg.email}</span></p>
            <p><strong className="text-muted-foreground">Pekerjaan:</strong> <span className="text-foreground font-medium">{selectedReg.job}</span></p>
          </div>
        </div>

        {/* Section 2: Alamat Pasang */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Lokasi Pemasangan</h4>
          <div className="space-y-2 rounded-lg bg-muted/40 p-3 text-sm">
            <p><strong className="text-muted-foreground">Alamat:</strong> <span className="text-foreground font-medium">{selectedReg.address}</span></p>
            <p><strong className="text-muted-foreground">RT/RW:</strong> <span className="text-foreground font-medium">{selectedReg.rtRw}</span></p>
            <p><strong className="text-muted-foreground">Area:</strong> <span className="text-foreground font-medium">{selectedReg.village}, {selectedReg.district}</span></p>
            <p><strong className="text-muted-foreground">Bangunan:</strong> <span className="text-foreground font-medium">{selectedReg.buildingType} ({selectedReg.ownershipStatus})</span></p>
            {selectedReg.mapsUrl && (
              <a 
                href={selectedReg.mapsUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-block mt-1 text-xs text-primary font-semibold hover:underline"
              >
                📍 Buka Google Maps Pelanggan
              </a>
            )}
          </div>
        </div>

        {/* Section 3: Paket Pilihan */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Paket Internet</h4>
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            <div>
              <p className="font-bold text-foreground">{selectedReg.package?.name || selectedReg.packageName}</p>
              <p className="text-xs text-muted-foreground">Harga paket bulanan</p>
            </div>
            <p className="font-bold text-primary text-base">
              Rp {(selectedReg.package?.price || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Tombol Eksekusi (Hanya tampil jika status masih PENDING) */}
      {selectedReg.status === "PENDING" && (
        <div className="border-t border-border pt-4 space-y-3">
          {!isRejecting ? (
            <div className="flex gap-3">
              {/* Tombol Tolak */}
              <button
                disabled={isProcessing}
                onClick={() => setIsRejecting(true)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
              >
                Tolak
              </button>
              
              {/* Tombol Terima & Buka WA */}
              <button
                disabled={isProcessing}
                onClick={() => onProcess("APPROVED")}
                className="flex-[2] px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? "Memproses..." : "Terima & Lanjut Teknis"}
              </button>
            </div>
          ) : (
            /* Mode Kolom Penolakan */
            <div className="space-y-3 rounded-lg border border-rose-100 bg-rose-50/30 p-3 animation-fadeIn">
              <label className="text-xs font-semibold text-rose-700">Alasan Penolakan Kantor:</label>
              <textarea
                disabled={isProcessing}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Wilayah belum ter-cover jaringan tiang Sicakra..."
                className="w-full text-sm p-2 rounded-md border border-rose-200 bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[70px]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  disabled={isProcessing}
                  onClick={() => {
                    setIsRejecting(false);
                    setRejectReason("");
                  }}
                  className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Batal
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => onProcess("REJECTED")}
                  className="px-3 py-1.5 rounded-md text-xs bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                >
                  {isProcessing ? "Memproses..." : "Konfirmasi Tolak"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Keterangan Tambahan Jika Sudah Diproses */}
      {selectedReg.status !== "PENDING" && (
        <div className="border-t border-border pt-4 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Pendaftaran ini telah diposisi <span className="uppercase font-bold">{selectedReg.status}</span>
            {selectedReg.rejectReason && ` karena: "${selectedReg.rejectReason}"`}
          </p>
        </div>
      )}
    </div>
  );
}