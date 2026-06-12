"use client";

import React from "react";
import { X, User, Phone, Mail, MapPin, Shield, Home, Package, FileText, ExternalLink } from "lucide-react";
import { Registration } from "@/lib/registrations";

interface RegistrationDetailModalProps {
  registration: Registration | null;
  onClose: () => void;
}

export function RegistrationDetailModal({ registration, onClose }: RegistrationDetailModalProps) {
  if (!registration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Slide-over panel dari kanan */}
      <div className="w-full max-w-xl h-full bg-sidebar border-l border-sidebar-border p-6 overflow-y-auto shadow-2xl flex flex-col space-y-6 animate-in slide-in-from-right duration-300">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-sidebar-border pb-4">
          <div>
            <span className="text-[10px] font-mono text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
              ID: {registration.id.toUpperCase()}
            </span>
            <h3 className="text-base font-bold text-foreground mt-1 capitalize">
              {registration.fullName}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-sidebar-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Konten */}
        <div className="flex-1 space-y-6 text-xs">
          
          {/* Section 1: Kontak Utama */}
          <div className="bg-sidebar-accent/20 p-4 rounded-xl border border-sidebar-border space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-accent" /> Informasi Kontak
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground">
              <div>
                <p className="opacity-60 text-[10px] uppercase font-semibold">Nomor Telepon</p>
                <p className="text-foreground font-medium mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-500" /> {registration.phone}</p>
              </div>
              <div>
                <p className="opacity-60 text-[10px] uppercase font-semibold">Email Aktif</p>
                <p className="text-foreground font-medium mt-0.5 flex items-center gap-1 truncate"><Mail className="w-3 h-3 text-amber-500" /> {registration.email}</p>
              </div>
              <div>
                <p className="opacity-60 text-[10px] uppercase font-semibold">Pekerjaan</p>
                <p className="text-foreground mt-0.5">{registration.job || "-"}</p>
              </div>
              <div>
                <p className="opacity-60 text-[10px] uppercase font-semibold">Nomor KTP</p>
                <p className="text-foreground font-mono mt-0.5">{registration.ktpNumber || "-"}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Detail Alamat Pasang & Geokordinat */}
          <div className="bg-sidebar-accent/20 p-4 rounded-xl border border-sidebar-border space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Alamat Pemasangan
            </h4>
            <div className="space-y-2 text-muted-foreground">
              <div>
                <p className="opacity-60 text-[10px] uppercase font-semibold">Alamat Lengkap</p>
                <p className="text-foreground mt-0.5 font-medium">{registration.address}</p>
                <p className="text-[11px] mt-0.5">RT/RW {registration.rtRw}, Kel. {registration.village}, Kec. {registration.district}, {registration.city} {registration.postalCode}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-sidebar-border/40">
                <div>
                  <p className="opacity-60 text-[10px] uppercase font-semibold">Kordinat (Lat / Lng)</p>
                  <p className="text-foreground font-mono mt-0.5">
                    {registration.latitude && registration.longitude ? `${registration.latitude}, ${registration.longitude}` : "Tidak ada koordinat"}
                  </p>
                </div>
                {registration.mapsUrl && (
                  <div className="flex items-end">
                    <a 
                      href={registration.mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 h-7 bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent rounded-md font-medium transition-colors"
                    >
                      <span>Buka Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Properti & Paket Internet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-sidebar-accent/20 p-4 rounded-xl border border-sidebar-border space-y-2">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-blue-500" /> Detail Bangunan
              </h4>
              <p className="text-muted-foreground">Tipe: <span className="text-foreground font-medium uppercase">{registration.buildingType}</span></p>
              <p className="text-muted-foreground">Kepemilikan: <span className="text-foreground font-medium uppercase">{registration.ownershipStatus.replace('_', ' ')}</span></p>
            </div>
            <div className="bg-sidebar-accent/20 p-4 rounded-xl border border-sidebar-border space-y-2">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-amber-500" /> Paket Pilihan
              </h4>
              <p className="text-foreground font-semibold">{registration.package?.name || "Layanan Custom"}</p>
              <p className="text-muted-foreground">Tarif: <span className="text-accent font-bold">Rp {registration.package?.price?.toLocaleString("id-ID") || 0}/bln</span></p>
            </div>
          </div>

          {/* Section 4: Lampiran Berkas Dokumen Foto */}
          <div className="space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-purple-500" /> Lampiran Berkas Validasi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Foto KTP */}
              <div className="space-y-1.5">
                <p className="text-muted-foreground opacity-70 font-medium">Foto KTP Pelanggan:</p>
                {registration.ktpPhotoUrl ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-sidebar-border bg-sidebar-accent/40 group">
                    <img 
                      src={registration.ktpPhotoUrl} 
                      alt="KTP" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-lg border border-dashed border-sidebar-border flex items-center justify-center text-muted-foreground opacity-60 bg-sidebar-accent/10">
                    Tidak melampirkan KTP
                  </div>
                )}
              </div>

              {/* Foto Lokasi/Rumah */}
              <div className="space-y-1.5">
                <p className="text-muted-foreground opacity-70 font-medium">Foto Lokasi Pemasangan:</p>
                {registration.housePhotoUrl ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-sidebar-border bg-sidebar-accent/40 group">
                    <img 
                      src={registration.housePhotoUrl} 
                      alt="Rumah" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-lg border border-dashed border-sidebar-border flex items-center justify-center text-muted-foreground opacity-60 bg-sidebar-accent/10">
                    Tidak melampirkan Foto Rumah
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Catatan Tambahan */}
          {registration.notes && (
            <div className="p-3 bg-amber-500/5 text-amber-500 border border-amber-500/10 rounded-lg">
              <p className="font-semibold mb-0.5">Catatan Pelanggan:</p>
              <p className="opacity-90">{registration.notes}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}