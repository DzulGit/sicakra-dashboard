"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X, MapPin, Home, Image as ImageIcon, User, Briefcase, Mail, Phone } from "lucide-react";

interface RegistrationDetailProps {
  selectedReg: any | null;
  onClose: () => void;
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
      {/* Backdrop Latar Belakang */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* 🔄 UKURAN UPGRADE: w-full max-w-lg md:max-w-2xl lg:max-w-3xl (Luas Maksimal!) */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedReg && (
          <>
            {/* Header Panel */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-foreground">Informasi Lengkap Berkas Pendaftar</h3>
                <p className="text-xs text-muted-foreground">Nomor Registrasi Sistem: {selectedReg.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Utama Detail (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* 🗺️ DYNAMIC GOOGLE MAPS LIVE PREVIEW PANEL */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Validasi Pemetaan Lokasi G-Maps</h4>
                <a 
                  href={selectedReg.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedReg.address)}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="block relative w-full h-64 rounded-2xl border border-border overflow-hidden bg-muted group cursor-pointer shadow-inner"
                  title="Klik untuk memperbesar dan buka di Google Maps asli"
                >
                  {/* Iframe Peta menggunakan query alamat dinamis pelanggan */}
                  <iframe
                    title="Sicakra WiFi Live Maps"
                    width="100%"
                    height="100%"
                    style={{ border: 0, pointerEvents: "none" }} // Trik kuncinya di sini biar box utuh bisa diklik gampang
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedReg.address || "Indonesia")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                  />
                  {/* Efek Hover Keren Masking Glass */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
                    <span className="bg-background/95 text-foreground text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary animate-bounce" />
                      Expand & Buka Tab Baru
                    </span>
                  </div>
                </a>
              </div>

              {/* Grid 2 Kolom untuk Biodata & Berkas Fisik Foto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* KIRI: Biodata Komplit */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profil & Kontak Pelanggan</h4>
                  <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3.5 text-sm">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div><p className="text-xs text-muted-foreground">Nama Lengkap</p><p className="font-semibold text-foreground">{selectedReg.fullName}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div><p className="text-xs text-muted-foreground">No. WhatsApp</p><p className="font-medium text-foreground">{selectedReg.phone}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div><p className="text-xs text-muted-foreground">Email Aktif</p><p className="font-medium text-foreground">{selectedReg.email}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <div><p className="text-xs text-muted-foreground">Pekerjaan</p><p className="font-medium text-foreground">{selectedReg.job || "-"}</p></div>
                    </div>
                  </div>
                </div>

                {/* KANAN: Lokasi Detail Alamat */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Spesifikasi Domisili</h4>
                  <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3 text-sm h-full">
                    <p className="border-b border-border/50 pb-2">
                      <span className="text-xs text-muted-foreground block mb-0.5">Alamat Jalan Lengkap:</span> 
                      <span className="text-foreground font-semibold">{selectedReg.address}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-muted-foreground block">RT/RW</span><span className="font-medium text-foreground text-sm">{selectedReg.rtRw}</span></div>
                      <div><span className="text-muted-foreground block">Kelurahan</span><span className="font-medium text-foreground text-sm">{selectedReg.village}</span></div>
                      <div><span className="text-muted-foreground block">Kecamatan</span><span className="font-medium text-foreground text-sm">{selectedReg.district}</span></div>
                      <div><span className="text-muted-foreground block">Tipe Bangunan</span><span className="font-medium text-foreground text-sm">{selectedReg.buildingType}</span></div>
                    </div>
                    <p className="pt-2 border-t border-border/50 text-xs">
                      <span className="text-muted-foreground">Status Kepemilikan:</span> <span className="font-bold text-primary">{selectedReg.ownershipStatus}</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* 📸 BARIS FOTO VALIDASI (KTP & DEPAN RUMAH) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Validasi Fisik Berkas Foto</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Foto KTP */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">Kartu Tanda Penduduk (KTP)</span>
                    <div className="relative aspect-[16/10] rounded-2xl border border-border bg-muted/50 overflow-hidden flex items-center justify-center group shadow-sm">
                      {selectedReg.ktpPhotoUrl || selectedReg.ktpPhoto ? (
                        <img 
                          src={selectedReg.ktpPhotoUrl || selectedReg.ktpPhoto} 
                          alt="Foto KTP" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center p-4 text-muted-foreground/60">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-xs">File KTP Kosong</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Foto Depan Rumah */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">Foto Kondisi Depan Rumah</span>
                    <div className="relative aspect-[16/10] rounded-2xl border border-border bg-muted/50 overflow-hidden flex items-center justify-center group shadow-sm">
                      {selectedReg.housePhotoUrl || selectedReg.housePhoto ? (
                        <img 
                          src={selectedReg.housePhotoUrl || selectedReg.housePhoto} 
                          alt="Foto Rumah" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center p-4 text-muted-foreground/60">
                          <Home className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-xs">File Rumah Kosong</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Paket Pilihan */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Paket Wifi Yang Dipesan</h4>
                <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
                  <div>
                    <p className="font-bold text-foreground text-base">{selectedReg.package?.name || selectedReg.packageName}</p>
                    <p className="text-xs text-muted-foreground">Harga paket terikat kontrak langganan</p>
                  </div>
                  <p className="font-black text-primary text-xl">
                    Rp {(selectedReg.package?.price || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Eksekusi Aksi */}
            {selectedReg.status === "PENDING" && (
              <div className="p-6 border-t border-border bg-card space-y-3">
                {!isRejecting ? (
                  <div className="flex gap-4">
                    <button
                      disabled={isProcessing}
                      onClick={() => setIsRejecting(true)}
                      className="flex-1 py-3 rounded-xl text-sm font-bold border border-rose-200 text-rose-600 hover:bg-rose-50/70 transition-colors disabled:opacity-50"
                    >
                      Tolak Pendaftaran
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => onProcess("APPROVED")}
                      className="flex-[2] py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? "Memproses Data..." : "Terima & Lanjut Kirim WA Akun"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 rounded-2xl border border-rose-100 bg-rose-50/20 p-4">
                    <label className="text-xs font-bold text-rose-700">Alasan Resmi Penolakan Berkas:</label>
                    <textarea
                      disabled={isProcessing}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Contoh: Alamat yang Anda daftarkan belum terjangkau oleh tiang distribusi FO Sicakra..."
                      className="w-full text-sm p-3 rounded-xl border border-rose-200 bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[80px]"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        disabled={isProcessing}
                        onClick={() => {
                          setIsRejecting(false);
                          setRejectReason("");
                        }}
                        className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground font-medium"
                      >
                        Batal
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => onProcess("REJECTED")}
                        className="px-4 py-2 rounded-lg text-xs bg-rose-600 text-white hover:bg-rose-700 font-bold shadow-sm"
                      >
                        Konfirmasi Tolak
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedReg.status !== "PENDING" && (
              <div className="p-6 border-t border-border text-center bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Arsip Berkas Ini Sudah Berstatus: <span className="text-foreground">{selectedReg.status}</span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}