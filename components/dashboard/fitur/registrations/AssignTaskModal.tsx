"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Loader2 } from "lucide-react";

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationData: any;
  onAssignSubmit: (id: string, payload: { surveyDate: string; surveyTime: string }) => Promise<boolean>;
}

export function AssignTaskModal({
  isOpen,
  onClose,
  registrationData,
  onAssignSubmit,
}: AssignTaskModalProps) {
  const [surveyDate, setSurveyDate] = useState("");
  const [surveyTime, setSurveyTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !registrationData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyDate || !surveyTime) {
      alert("Mohon isi tanggal dan slot jam pemasangan terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    const success = await onAssignSubmit(registrationData.id, {
      surveyDate,
      surveyTime,
    });
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md border border-border bg-card p-6 shadow-lg rounded-xl relative">
        
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Judul Modal */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-foreground">Atur Jadwal & Tugaskan Teknisi</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Masukkan hasil kompromi WhatsApp dengan pelanggan: <span className="text-foreground font-semibold">{registrationData.fullName}</span>
          </p>
        </div>

        {/* Form Input Internal Operasional */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          
          {/* Input Tanggal */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground font-sans font-semibold">
              Tanggal Pemasangan Final
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                required
                value={surveyDate}
                onChange={(e) => setSurveyDate(e.target.value)}
                className="w-full bg-transparent border border-border px-9 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors rounded-lg"
              />
            </div>
          </div>

          {/* Input Slot Jam */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-muted-foreground font-sans font-semibold">
              Slot Jam Kunjungan Teknisi
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                required
                value={surveyTime}
                onChange={(e) => setSurveyTime(e.target.value)}
                className="w-full bg-card border border-border px-9 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors rounded-lg appearance-none"
              >
                <option value="">Pilih Slot Waktu</option>
                <option value="08:00-10:00">08:00 - 10:00 WIB</option>
                <option value="10:00-12:00">10:00 - 12:00 WIB</option>
                <option value="13:00-15:00">13:00 - 15:00 WIB</option>
                <option value="15:00-17:00">15:00 - 17:00 WIB</option>
              </select>
            </div>
          </div>

          {/* Tombol Konfirmasi Akhir */}
          <div className="pt-4 border-t border-border flex justify-end gap-3 font-sans">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? "Memproses..." : "Kirim ke Tim Teknis"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}