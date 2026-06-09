"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Wrench, MapPin, Phone, CheckCircle, ShieldAlert, Cpu, Copy } from "lucide-react";
import { useAuth } from "@clerk/nextjs"; // 👈 1. KITA IMPORT CLERK DI SINI

interface TeknisFiturProps {
  initialTasks: any[];
  // 👈 apiCompleteFn KITA HAPUS BIAR GAK ERROR NEXT.JS
}

export function TeknisFitur({ initialTasks = [] }: TeknisFiturProps) {
  // 🔥 Filter aman buat ngindarin error map
  const validData = Array.isArray(initialTasks) ? initialTasks : [];
  const [tasks, setTasks] = useState<any[]>(validData);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [activatedAccount, setActivatedAccount] = useState<{ name: string; token: string; phone: string } | null>(null);

  // 👈 2. PANGGIL FUNGSI TOKEN
  const { getToken } = useAuth();

  const handleCompleteInstallation = async (id: string, customerName: string, customerPhone: string) => {
    if (!confirm(`Apakah instalasi fisik di rumah ${customerName} benar-benar sudah selesai dan internet sudah menyala?`)) return;
    
    setProcessingId(id);
    try {
      const clerkToken = await getToken({ template: "nestjs" });

      // 🔥 FIX 1: Ubah METHOD menjadi POST sesuai controller NestJS lu!
      const response = await fetch(`http://localhost:3000/registrations/${id}/complete`, {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${clerkToken}` 
        },
      });

      if (!response.ok) throw new Error("Gagal aktivasi di server");

      const result = await response.json(); // NestJS mereturn object activatedUser langsung
      
      setActivatedAccount({
        name: customerName,
        // 🔥 FIX 2: Sesuaikan property dari database lu (usernameToken)
        token: result.usernameToken || "GANTIAN-TOKEN", 
        phone: customerPhone
      });
      
      // Hapus dari antrian tugas teknisi karena sudah berstatus COMPLETED
      setTasks(prev => prev.filter(task => task.id !== id));
      
    } catch (error) {
      console.error(error);
      alert("Gagal memproses aktivasi. Cek koneksi server backend!");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* HEADER HALAMAN */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Perintah Kerja & Aktivasi Token
        </h1>
        <p className="text-sm text-muted-foreground">
          Daftar lokasi pemasangan baru Sicakra WiFi yang ditugaskan kepada Anda hari ini.
        </p>
      </div>

      {/* 🔮 NOTIFIKASI POP-UP SUKSES GENERATE TOKEN (Untuk Edukasi di Tempat Pelanggan) */}
      {activatedAccount && (
        <div className="p-6 border border-emerald-500/20 bg-emerald-500/5 rounded-xl space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 text-emerald-500">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold text-base text-foreground">Instalasi Berhasil & Akun Aktif!</h3>
              <p className="text-xs text-muted-foreground">Teknisi bisa langsung memberikan detail akun ini ke pelanggan sebelum pulang.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-background p-4 rounded-lg border border-border font-mono text-xs">
            <div>
              <p className="text-muted-foreground mb-1">NAMA PELANGGAN:</p>
              <p className="text-foreground font-bold">{activatedAccount.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">PASSWORD (NO. HP):</p>
              <p className="text-foreground font-bold">{activatedAccount.phone}</p>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-border/60 flex items-center justify-between">
              <div>
                <p className="text-primary font-bold mb-0.5">USERNAME TOKEN (HOTSPOT):</p>
                <p className="text-xl font-extrabold text-foreground tracking-wider">{activatedAccount.token}</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`Token: ${activatedAccount.token}\nPassword: ${activatedAccount.phone}`);
                  alert("Detail akun berhasil disalin!");
                }}
                className="p-2 border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                title="Salin Akun"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            onClick={() => setActivatedAccount(null)}
            className="text-xs font-semibold px-4 py-2 border border-border rounded-lg hover:bg-muted text-foreground transition-colors"
          >
            Tutup Pemberitahuan
          </button>
        </div>
      )}

      {/* 📋 LIST WORK ORDERS TIM TEKNIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-dashed border-sidebar-border rounded-xl bg-sidebar text-muted-foreground">
            <Wrench className="w-8 h-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
            <p className="font-medium">Jadwal pemasangan Anda kosong hari ini.</p>
            <p className="text-xs text-muted-foreground/80 mt-1">Seluruh pesanan sudah aktif atau belum dijadwalkan oleh operasional.</p>
          </div>
        ) : (
          tasks.map((task: any) => (
            <div
              key={task.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all"
            >
              {/* Bagian Atas: Info Pelanggan & Paket */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-foreground tracking-tight">{task.fullName}</h3>
                    <p className="text-xs text-primary font-semibold mt-0.5 uppercase tracking-wide">
                      📦 Paket: {task.package?.name || "Premium Fiber"}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase text-amber-500 border border-amber-500/20">
                    {task.surveyTime || "Jam Kerja"}
                  </span>
                </div>

                <div className="space-y-2 border-t border-border/60 pt-3 text-xs text-muted-foreground font-medium">
                  {/* Alamat Lengkap */}
                  <div className="flex items-start gap-2 text-foreground/90">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{task.address}, RT/RW {task.rtRw}, Kel. {task.village}, Kec. {task.district}, {task.city}</span>
                  </div>
                  
                  {/* Kontak */}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>WhatsApp: {task.phone}</span>
                  </div>
                </div>

                {task.notes && (
                  <div className="p-3 bg-muted/40 rounded-lg text-xs border border-border/40 text-muted-foreground italic">
                    <span className="font-bold uppercase text-[9px] block text-foreground tracking-wider mb-0.5">Catatan Rumah:</span>
                    "{task.notes}"
                  </div>
                )}
              </div>

              {/* Bagian Bawah: Aksi Eksekusi Selesai Pasang */}
              <div className="border-t border-border/60 mt-5 pt-4 flex gap-2">
                {task.mapsUrl && (
                  <a
                    href={task.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex items-center justify-center"
                    title="Buka Navigasi Google Maps Rumah User"
                  >
                    <MapPin className="w-4.5 h-4.5" />
                  </a>
                )}
                
                <button
                  onClick={() => handleCompleteInstallation(task.id, task.fullName, task.phone)}
                  disabled={processingId === task.id}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Cpu className={cn("w-4 h-4", processingId === task.id && "animate-spin")} />
                  <span>{processingId === task.id ? "Mengaktifkan Token..." : "Selesai Instalasi & Auto-Generate Token"}</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}