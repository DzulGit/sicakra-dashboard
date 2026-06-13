"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, ExternalLink, MapPin, FileText, User, Phone, 
  Mail, Briefcase, CreditCard, Building2, Home, Maximize2, Minimize2, Check, X, Loader2, MessageSquare
} from "lucide-react";
import { Registration } from "@/lib/registrations";
import { Input } from "@/components/ui/input";

interface RegistrationDetailPanelProps {
  registration: Registration;
  actionId: string | null;
  onClose: () => void;  
  onValidate: (id: string, action: "APPROVED" | "REJECTED", payload?: any) => void;
}

export function RegistrationDetailPanel({ registration, actionId, onClose, onValidate }: RegistrationDetailPanelProps) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [surveyDate, setSurveyDate] = useState("");
  const [surveyTime, setSurveyTime] = useState("");
  const isProcessing = actionId === registration.id;

  const formattedPrice = registration.package?.price 
    ? `Rp ${registration.package.price.toLocaleString("id-ID")}` 
    : "-";

  // 🔥 CORE ENGINE: Generator Tautan API WhatsApp Otomatis & Dinamis
  const generateWhatsAppCoordinationLink = (phone: string, id: string, fullName: string) => {
    // 1. Bersihkan karakter non-angka
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    
    // 2. Ubah prefix lokal 08 menjadi format internasional 628
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.substring(1);
    }
    
    // 3. Racik template dummy teks profesional operasional Sicakra
    const messageTemplate = `Halo bapak/ibu ${fullName.toUpperCase()},\n\nSaya dari tim operasional Sicakra WiFi. Menindaklanjuti berkas pendaftaran pasang baru internet Anda dengan nomor registrasi ID: ${id.toUpperCase().substring(0, 8)}, kami ingin berdiskusi lebih lanjut untuk menentukan kesepakatan JADWAL TANGGAL DAN JAM pelaksanaan kunjungan survey serta pemasangan alat di lokasi rumah Anda.\n\nApakah ada waktu luang di minggu ini? Terima kasih.`;
    
    // 4. Return URL WhatsApp API resmi
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageTemplate)}`;
  };

  const whatsappLink = generateWhatsAppCoordinationLink(registration.phone, registration.id, registration.fullName);

  return (
    // FLOW STANDARD: Presisi mengikuti container dashboard lu tanpa meluber
    <div className="w-full space-y-6 text-foreground animate-in fade-in duration-200">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="gap-2 bg-secondary/60 border-border text-sm font-medium px-4 h-9"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar</span>
          </Button>
          <Badge className="bg-accent/20 text-accent border border-accent/30 font-bold text-xs px-2.5 py-0.5">
            {registration.status}
          </Badge>
        </div>
        <div className="text-xs font-mono text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded border border-border font-semibold tracking-wider">
          REGISTRATION ID: {registration.id.toUpperCase()}
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground capitalize">{registration.fullName}</h1>
        <p className="text-sm text-muted-foreground">Sistem manajemen verifikasi berkas pendaftaran, penentuan titik koordinat, dan alur integrasi koordinasi jadwal.</p>
      </div>

      {/* Main Flow Content */}
      <div className="space-y-6">
        
        {/* SECTION 1: DATA IDENTITAS */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-accent" /> 1. Data Identitas Lengkap Pemohon
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card border border-border p-6 rounded-xl shadow-sm text-sm">
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-xs font-medium block">Nama Sesuai KTP</span>
              <p className="text-foreground font-bold text-base capitalize">{registration.fullName}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-xs font-medium block">Nomor Induk Kependudukan (NIK)</span>
              <p className="text-foreground font-mono font-bold text-base tracking-wide bg-secondary/40 px-2 py-0.5 rounded border border-border inline-block">{registration.ktpNumber || "Tidak Terisi"}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-xs font-medium block">Profesi / Pekerjaan</span>
              <p className="text-foreground font-semibold text-base flex items-center gap-1.5 capitalize">
                <Briefcase className="w-4 h-4 text-muted-foreground opacity-60" /> {registration.job}
              </p>
            </div>
            <div className="space-y-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-border/40">
              <span className="text-muted-foreground text-xs font-medium block">Nomor WhatsApp Aktif</span>
              <p className="text-foreground font-bold text-base flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" /> {registration.phone}
              </p>
            </div>
            <div className="space-y-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 md:col-span-2">
              <span className="text-muted-foreground text-xs font-medium block">Alamat Email Pelanggan</span>
              <p className="text-foreground font-bold text-base flex items-center gap-2 truncate">
                <Mail className="w-4 h-4 text-amber-500" /> {registration.email}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: LOKASI & MAPS (Split Kiri-Kanan) */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" /> 2. Titik Distribusi Rumah & Live Geokordinat
          </h4>
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm text-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Sisi Kiri (5 Kolom): Data Alamat Tekstual */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-muted-foreground text-xs font-medium block">Alamat Utama Pemasangan</span>
                  <p className="text-foreground font-bold text-base leading-snug">{registration.address}</p>
                </div>
                <div className="space-y-1 bg-secondary/30 p-3 rounded-lg border border-border">
                  <span className="text-muted-foreground text-[11px] font-medium block">Detail Wilayah</span>
                  <p className="text-foreground font-medium text-xs">
                    RT/RW {registration.rtRw}, Kel. {registration.village}<br />
                    Kec. {registration.district}, Kota {registration.city} {registration.postalCode || ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {registration.mapsUrl && (
                    <a href={registration.mapsUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="outline" className="w-full h-9 text-xs bg-secondary hover:bg-secondary/80 font-semibold text-accent gap-1.5 border-accent/20">
                        Buka Google Maps Utama <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Sisi Kanan (7 Kolom): Live Embedded Map Google Maps */}
              <div className="lg:col-span-7 space-y-2 w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-muted-foreground font-semibold bg-secondary px-2.5 py-1 rounded border border-border">
                    Koordinat: {registration.latitude && registration.longitude ? `${registration.latitude}, ${registration.longitude}` : "0, 0"}
                  </span>
                  <Button size="sm" variant="outline" className="h-7 text-xs bg-secondary font-medium" onClick={() => setIsMapExpanded(!isMapExpanded)}>
                    {isMapExpanded ? <><Minimize2 className="w-3 h-3 mr-1" /> Perkecil Peta</> : <><Maximize2 className="w-3 h-3 mr-1" /> Perbesar Peta</>}
                  </Button>
                </div>

                {registration.latitude && registration.longitude ? (
                  <div className={`w-full rounded-xl overflow-hidden border border-border shadow-inner transition-all duration-300 ${isMapExpanded ? "h-[400px]" : "h-44"}`}>
                    <iframe
                      width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
                      referrerPolicy={"no-referrer-when-cross-origin" as any}
                      src={`https://maps.google.com/maps?q=${registration.latitude},${registration.longitude}&z=15&output=embed`}
                    />
                  </div>
                ) : (
                  <div className="h-44 rounded-xl border border-dashed border-border bg-secondary/20 flex items-center justify-center text-muted-foreground font-medium">Data koordinat Supabase tidak tersedia.</div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 3: KONTRAK & HARGA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3 text-sm">
            <h4 className="font-bold text-foreground flex items-center gap-2 border-b border-border pb-2"><Building2 className="w-4 h-4 text-blue-500" /> Spesifikasi Lokasi & Properti</h4>
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-muted-foreground text-xs">Jenis Bangunan</span><p className="font-bold uppercase text-foreground text-sm mt-0.5">{registration.buildingType}</p></div>
              <div><span className="text-muted-foreground text-xs">Status Kepemilikan</span><p className="font-bold uppercase text-foreground text-sm mt-0.5">{registration.ownershipStatus?.replace('_', ' ')}</p></div>
            </div>
          </div>
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3 text-sm">
            <h4 className="font-bold text-foreground flex items-center gap-2 border-b border-border pb-2"><CreditCard className="w-4 h-4 text-amber-500" /> Kontrak Layanan WiFi</h4>
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-muted-foreground text-xs">Layanan Pilihan</span><p className="font-extrabold text-accent text-sm mt-0.5 tracking-tight">{registration.package?.name || "Custom"}</p></div>
              <div><span className="text-muted-foreground text-xs">Abunemen Bulanan</span><p className="font-extrabold text-chart-1 text-sm mt-0.5">{formattedPrice} <span className="text-[10px] text-muted-foreground font-normal">/bln</span></p></div>
            </div>
          </div>
        </div>

        {/* 🔥 NEW SECTION 4: PUSAT DISKUSI JADWAL VIA WHATSAPP (CRM CRM SAKTI) */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" /> 3. Pusat Koordinasi & Diskusi Jadwal Lapangan
          </h4>
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm text-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Tampilan Teks Dummy Template CRM */}
            <div className="md:col-span-8 space-y-2 bg-secondary/30 p-4 rounded-lg border border-border border-l-4 border-l-emerald-500">
              <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider block">Preview Pesan Koordinasi Otomatis:</span>
              <p className="text-foreground italic text-xs leading-relaxed opacity-90 whitespace-pre-line">
                "Halo bapak/ibu {registration.fullName.toUpperCase()}, saya dari tim operasional Sicakra WiFi. Menindaklanjuti berkas pendaftaran pasang baru internet Anda (ID: {registration.id.toUpperCase().substring(0, 8)}), kami ingin berdiskusi untuk menentukan kesepakatan JADWAL TANGGAL DAN JAM kunjungan survey..."
              </p>
            </div>
            {/* Tombol Eksekusi Click-to-Chat */}
            <div className="md:col-span-4 w-full">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border-0">
                  <MessageSquare className="w-4 h-4" />
                  Hubungi Pelanggan (WA)
                </Button>
              </a>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5 font-medium">Klik untuk membuka obrolan langsung</p>
            </div>
          </div>
        </div>

        {/* SECTION 5: LAMPIRAN FOTO BERKAS */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" /> 4. Berkas Lampiran Dokumentasi Digital
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3">
              <p className="font-bold text-foreground border-b border-border pb-2 flex items-center gap-1.5">📁 Berkas KTP Asli Pelanggan</p>
              {registration.ktpPhotoUrl ? (
                <a href={registration.ktpPhotoUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-[16/10] rounded-lg border border-border overflow-hidden bg-secondary/10 group cursor-zoom-in">
                  <img src={registration.ktpPhotoUrl} alt="KTP" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">Lihat Berkas Asli ↗</div>
                </a>
              ) : (
                <div className="aspect-[16/10] rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground bg-secondary/5 font-semibold">File foto KTP tidak tersedia</div>
              )}
            </div>
            <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3">
              <p className="font-bold text-foreground border-b border-border pb-2 flex items-center gap-1.5">🏠 Foto Kondisi Depan Rumah</p>
              {registration.housePhotoUrl ? (
                <a href={registration.housePhotoUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-[16/10] rounded-lg border border-border overflow-hidden bg-secondary/10 group cursor-zoom-in">
                  <img src={registration.housePhotoUrl} alt="Rumah" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">Lihat Berkas Asli ↗</div>
                </a>
              ) : (
                <div className="aspect-[16/10] rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground bg-secondary/5 font-semibold">File foto lokasi tidak tersedia</div>
              )}
            </div>
          </div>
        </div>

        {/* Catatan Tambahan */}
        {registration.notes && (
          <div className="p-4 bg-amber-500/5 text-amber-500 border border-amber-500/20 rounded-xl text-sm leading-relaxed font-medium">
            <p className="font-bold text-foreground mb-1 flex items-center gap-1.5">🔔 Catatan Lapangan:</p>
            <p className="opacity-90">{registration.notes}</p>
          </div>
        )}

        {/* PANEL TOMBOL VALIDASI */}
        {registration.status === "PENDING" && (
          <div className="pt-4 border-t border-border mt-6">
            {isApproving ? (
              // TAMPILAN FORM JADWAL (MUNCUL PAS KLIK APPROVE)
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-xl space-y-4 animate-in slide-in-from-bottom-2">
                <h4 className="font-bold text-sm text-emerald-500 border-b border-emerald-500/20 pb-2">Tentukan Jadwal Teknisi</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tanggal</label>
                    <Input type="date" value={surveyDate} onChange={(e) => setSurveyDate(e.target.value)} className="bg-card border-emerald-500/30" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Jam</label>
                    <Input type="time" value={surveyTime} onChange={(e) => setSurveyTime(e.target.value)} className="bg-card border-emerald-500/30" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button 
                    onClick={() => onValidate(registration.id, "APPROVED", { surveyDate, surveyTime })} 
                    disabled={isProcessing || !surveyDate || !surveyTime} 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} Kirim Jadwal & Tugaskan
                  </Button>
                  <Button onClick={() => setIsApproving(false)} disabled={isProcessing} variant="outline" className="px-6 border-border bg-card">Batal</Button>
                </div>
              </div>
            ) : (
              // TAMPILAN TOMBOL DEFAULT
              <div className="flex items-center gap-4">
                <Button onClick={() => setIsApproving(true)} variant="outline" className="flex-1 h-11 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 font-bold text-sm bg-transparent transition-all">
                  <Check className="w-4 h-4 mr-2" /> Setujui Berkas & Jadwalkan Teknisi
                </Button>
                <Button onClick={() => onValidate(registration.id, "REJECTED")} variant="outline" className="flex-1 h-11 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold text-sm bg-transparent transition-all">
                  <X className="w-4 h-4 mr-2" /> Tolak Berkas Registrasi
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}