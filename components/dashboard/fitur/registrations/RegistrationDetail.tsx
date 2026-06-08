"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X, MapPin, Home, Image as ImageIcon } from "lucide-react";

interface RegistrationDetailProps {
  selectedReg: any | null;
  onClose: () => void; // Fungsi untuk menutup panel
  isProcessing: boolean;
  isRejecting: boolean;
  setIsRejecting: (val: boolean) => void;
  rejectReason: string;
  setRejectReason: (val: string) => void;
  onProcess: (status: "APPROVED" | "REJECTED") => void;
}

export function RegistrationDetail({
  selectedReg,
  onClose,
  isProcessing,
  isRejecting,
  setIsRejecting,
  rejectReason,
  setRejectReason,
  onProcess,
}: RegistrationDetailProps) {
  
  const isOpen = !!selectedReg;

  return (
    <>
      {/* Gelap/Backdrop di latar belakang saat panel kebuka */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Slide-over Panel (Meluncur Mulus dari Samping Kanan) */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-full max-w-md sm:max-w-lg bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedReg && (
          <>
            {/* Header Panel */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">Detail Pendaftaran</h3>
                <p className="text-xs text-muted-foreground">ID Registrasi: {selectedReg.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* 📸 BERKAS FOTO FISIK (KTP & RUMAH) YANG KETINGGALAN */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Berkas Foto Fisik</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Container Foto KTP */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">Foto KTP Pelanggan</span>
                    <div className="relative aspect-[4/3] rounded-xl border border-border bg-muted/50 overflow-hidden flex items-center justify-center group">
                      {selectedReg.ktpPhotoUrl || selectedReg.ktpPhoto ? (
                        <img 
                          src={selectedReg.ktpPhotoUrl || selectedReg.ktpPhoto} 
                          alt="Foto KTP" 
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center p-4 text-muted-foreground/60">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-xs">Tidak ada file KTP</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Container Foto Depan Rumah */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">Foto Depan Rumah</span>
                    <div className="relative aspect-[4/3] rounded-xl border border-border bg-muted/50 overflow-hidden flex items-center justify-center group">
                      {selectedReg.housePhotoUrl || selectedReg.housePhoto ? (
                        <img 
                          src={selectedReg.housePhotoUrl || selectedReg.housePhoto} 
                          alt="Foto Depan Rumah" 
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center p-4 text-muted-foreground/60">
                          <Home className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-xs">Tidak ada file rumah</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Data Biodata */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Pelanggan</h4>
                <div className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
                  <p className="flex justify-between"><span className="text-muted-foreground">Nama:</span> <span className="text-foreground font-semibold">{selectedReg.fullName}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">WhatsApp:</span> <span className="text-foreground font-medium">{selectedReg.phone}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="text-foreground font-medium">{selectedReg.email}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">Pekerjaan:</span> <span className="text-foreground font-medium">{selectedReg.job}</span></p>
                </div>
              </div>

              {/* Data Lokasi */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lokasi Pemasangan</h4>
                <div className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
                  <p><span className="text-muted-foreground block mb-0.5">Alamat:</span> <span className="text-foreground font-medium">{selectedReg.address}, RT/RW {selectedReg.rtRw}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">Area:</span> <span className="text-foreground font-medium">{selectedReg.village}, {selectedReg.district}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">Bangunan:</span> <span className="text-foreground font-medium">{selectedReg.buildingType} ({selectedReg.ownershipStatus})</span></p>
                  {selectedReg.mapsUrl && (
                    <a 
                      href={selectedReg.mapsUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-bold hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Buka Google Maps Pelanggan
                    </a>
                  )}
                </div>
              </div>

              {/* Pilihan Paket */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Paket Pilihan</h4>
                <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
                  <div>
                    <p className="font-bold text-foreground">{selectedReg.package?.name || selectedReg.packageName}</p>
                    <p className="text-xs text-muted-foreground">Harga paket bulanan</p>
                  </div>
                  <p className="font-extrabold text-primary text-lg">
                    Rp {(selectedReg.package?.price || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Aksi Pilihan Kelola */}
            {selectedReg.status === "PENDING" && (
              <div className="p-6 border-t border-border bg-card space-y-3">
                {!isRejecting ? (
                  <div className="flex gap-3">
                    <button
                      disabled={isProcessing}
                      onClick={() => setIsRejecting(true)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => onProcess("APPROVED")}
                      className="flex-[2] py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
                    >
                      {isProcessing ? "Memproses..." : "Terima & Lanjut Teknis"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 rounded-xl border border-rose-100 bg-rose-50/30 p-4">
                    <label className="text-xs font-bold text-rose-700">Alasan Penolakan:</label>
                    <textarea
                      disabled={isProcessing}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Tulis alasan resmi penolakan..."
                      className="w-full text-sm p-2.5 rounded-xl border border-rose-200 bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[70px]"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        disabled={isProcessing}
                        onClick={() => {
                          setIsRejecting(false);
                          setRejectReason("");
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground"
                      >
                        Batal
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => onProcess("REJECTED")}
                        className="px-3 py-1.5 rounded-lg text-xs bg-rose-600 text-white hover:bg-rose-700"
                      >
                        Konfirmasi Tolak
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedReg.status !== "PENDING" && (
              <div className="p-6 border-t border-border text-center bg-muted/20 text-xs font-medium text-muted-foreground">
                Berkas berstatus <span className="uppercase font-bold text-foreground">{selectedReg.status}</span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}