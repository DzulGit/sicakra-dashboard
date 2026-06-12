"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { ClipboardList, Search, Loader2 } from "lucide-react";
import { fetchRegistrations, processRegistration, Registration } from "@/lib/registrations";

// 🔥 FIX PERBAIKAN 1: Alamat import diluruskan (karena filenya bertetangga/satu folder)
import { RegistrationsTable } from "./registrations-table";
import { RegistrationDetailModal } from "./registration-detail-modal";

export function RegistrationsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // 🔥 FIX PERBAIKAN 2: Berikan tipe data <Registration[]> pada useSWR
  const { data: registrations, error, isLoading, mutate } = useSWR<Registration[]>(
    'registrationsList', 
    () => fetchRegistrations() 
  );

  const handleValidate = async (id: string, action: "APPROVED" | "REJECTED") => {
    if (!confirm(`Apakah Anda yakin ingin mengubah status pendaftaran ini menjadi ${action}?`)) return;
    
    setActionId(id);
    try {
      const data = action === "REJECTED" 
        ? { status: action, rejectReason: "Persyaratan berkas dokumen tidak memenuhi standar operasional." }
        : { status: action, surveyDate: "-", surveyTime: "-" }; 
        
      await processRegistration(id, data);
      mutate(); 
    } catch (err) {
      alert("Gagal memproses aksi. Cek endpoint PATCH backend.");
    } finally {
      setActionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-xs font-medium tracking-wide">Sinkronisasi data enkripsi server Sicakra...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-80 text-rose-500 font-medium border border-rose-500/10 bg-rose-500/5 rounded-xl">
        <p className="text-xs">Gagal memuat data. Periksa koneksi gerbang API atau status CORS backend.</p>
      </div>
    );
  }

  // 🔥 FIX PERBAIKAN 3: Karena data dari lib sudah murni array, langsung filter safely
  const filteredData = (registrations || []).filter(
    (item: Registration) =>
      item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sidebar-border pb-5">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-accent" />
            <span>Validasi Pendaftaran Pelanggan</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Verifikasi berkas, lokasi koordinat, dan manajemen paket internet pasang baru.
          </p>
        </div>
        
        {/* Search Bar Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-sidebar border border-sidebar-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>
      </div>

      {/* RENDER TABLE COMPONENT */}
      <RegistrationsTable 
        data={filteredData}
        actionId={actionId}
        // 🔥 FIX PERBAIKAN 4: Parameter 'reg' tipenya otomatis aman terdeteksi sekarang
        onViewDetail={(reg: Registration) => setSelectedReg(reg)} 
        onValidate={handleValidate}
      />

      {/* RENDER DETAIL MODAL COMPONENT */}
      <RegistrationDetailModal 
        registration={selectedReg}
        onClose={() => setSelectedReg(null)} 
      />
    </div>
  );
}