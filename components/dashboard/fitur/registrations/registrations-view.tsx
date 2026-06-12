"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchRegistrations, processRegistration, Registration } from "@/lib/registrations";

import { SummaryCards } from "./summary-cards";
import { RegistrationCard } from "./registration-card";
import { RegistrationDetailPanel } from "./registration-detail-panel";

export function RegistrationsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const { data: registrations, error, isLoading, mutate } = useSWR<Registration[]>(
    'registrationsList', 
    () => fetchRegistrations() 
  );

  const handleValidate = async (id: string, action: "APPROVED" | "REJECTED") => {
    if (!confirm(`Konfirmasi penentuan status operasional menjadi ${action}?`)) return;
    
    setActionId(id);
    try {
      const data = action === "REJECTED" 
        ? { status: action, rejectReason: "Persyaratan berkas dokumen tidak memenuhi standar operasional." }
        : { status: action, surveyDate: "-", surveyTime: "-" }; 
        
      await processRegistration(id, data);
      
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg({ ...selectedReg, status: action });
      }
      
      mutate(); 
    } catch (err) {
      alert("Gagal memproses validasi pendaftaran.");
    } finally {
      setActionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-xs font-medium">Menghubungkan gerbang database Sicakra...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive font-medium">
        <span>Gagal terhubung ke gerbang API utama server Sicakra.</span>
      </div>
    );
  }

  const rawData = registrations || [];

  const filteredCustomers = rawData.filter((customer) => {
    const matchesSearch =
      customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // 🔥 CORE FIX: Conditional Switcher! Jika ada data terpilih, matikan view list dan tukar ke detail penuh
  if (selectedReg) {
    return (
      <RegistrationDetailPanel 
        registration={selectedReg}
        actionId={actionId}
        onClose={() => setSelectedReg(null)}
        onValidate={handleValidate}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Summary Stat Cards */}
      <SummaryCards data={rawData} />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau ID registrasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[280px] bg-secondary border-border focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {["PENDING", "APPROVED", "REJECTED"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                className={selectedStatus === status ? "bg-accent text-accent-foreground" : "bg-transparent border-border"}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom Penuh Sesuai Template Utama Lu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((row, index) => (
            <RegistrationCard 
              key={row.id}
              registration={row}
              index={index}
              isSelected={false}
              onSelect={(reg) => setSelectedReg(reg)} 
            />
          ))
        ) : (
          <div className="col-span-1 lg:col-span-2 border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground bg-card">
            Tidak ditemukan data pendaftaran aktif yang cocok dengan kriteria.
          </div>
        )}
      </div>
    </div>
  );
}