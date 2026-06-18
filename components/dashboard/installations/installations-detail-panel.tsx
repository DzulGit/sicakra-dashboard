"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, User, Phone, CheckCircle2, Loader2, MessageSquare } from "lucide-react";

export function InstallationsDetailPanel({ task, actionId, onClose, onComplete }: any) {
  const isProcessing = actionId === task.id;
  const isCompleted = task.status === "COMPLETED";
  const waLink = `https://wa.me/${task.user?.phone?.replace(/[^0-9]/g, "").replace(/^0/, "62")}?text=Halo Bapak/Ibu ${task.user?.fullName}, saya teknisi Sicakra WiFi yang akan melakukan instalasi layanan tambahan hari ini.`;

  return (
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 text-foreground">
      <div className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Button onClick={onClose} variant="outline" size="sm" className="gap-2 text-xs">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Tabel
        </Button>
        <Badge className={isCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}>
          {isCompleted ? "Selesai" : "Menunggu Instalasi"}
        </Badge>
      </div>

      <div className="max-w-3xl mx-auto w-full p-6 space-y-8 pb-24">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Detail Instalasi Tambahan</h1>
          <p className="text-sm text-muted-foreground mt-2 font-mono">ID Pengajuan: {task.id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Info Pelanggan
            </h3>
            <div className="bg-secondary/50 border border-border p-5 rounded-xl space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Nama Lengkap</p>
                <p className="font-bold text-foreground text-lg">{task.user?.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kontak</p>
                <div className="flex flex-col gap-2 mt-1">
                  <p className="font-mono text-sm text-foreground">{task.user?.phone}</p>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors w-fit">
                    <MessageSquare className="w-4 h-4" /> Hubungi via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Lokasi Pemasangan Baru
            </h3>
            <div className="bg-secondary/50 border border-border p-5 rounded-xl h-full">
              <p className="text-sm text-foreground leading-relaxed">{task.newAddress}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          {isCompleted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-emerald-500">Instalasi Selesai</h3>
              <p className="text-sm text-muted-foreground">Layanan tambahan telah diaktifkan dan tagihan pertama diterbitkan.</p>
            </div>
          ) : (
            <Button 
              onClick={() => onComplete(task.id)} 
              disabled={isProcessing}
              className="w-full h-16 text-lg font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <CheckCircle2 className="w-6 h-6 mr-3" />}
              {isProcessing ? "Memproses..." : "Selesaikan Instalasi & Aktifkan Layanan"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}