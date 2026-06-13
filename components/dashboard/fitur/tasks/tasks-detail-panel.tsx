"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, User, Phone, CheckCircle2, Key, ExternalLink, Maximize2, Minimize2, Loader2, MessageSquare
} from "lucide-react";

export function TaskDetailPanel({ task, actionId, onClose, onComplete }: any) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const isProcessing = actionId === task.id;
  const isCompleted = task.status === "COMPLETED";

  const waLink = `https://wa.me/${task.phone.replace(/[^0-9]/g, "").replace(/^0/, "62")}?text=Halo Bapak/Ibu ${task.fullName}, saya teknisi Sicakra WiFi yang akan melakukan instalasi hari ini.`;

  return (
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 text-foreground">
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Button onClick={onClose} variant="outline" size="sm" className="gap-2 text-xs">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Tabel
        </Button>
        <Badge className={isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"}>
          {isCompleted ? "INSTALASI SELESAI" : "PROSES INSTALASI"}
        </Badge>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold capitalize">{task.fullName}</h1>
          <p className="text-sm text-muted-foreground mt-1">ID Tugas: {task.id.toUpperCase()}</p>
        </div>

        {/* INFO LOKASI & MAP */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" /> Lokasi Pemasangan
          </h4>
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
            <p className="font-bold text-base">{task.address}</p>
            <p className="text-sm text-muted-foreground">RT/RW {task.rtRw}, Kel. {task.village}, {task.district}, {task.city}</p>
            
            {task.latitude && task.longitude ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsMapExpanded(!isMapExpanded)}>
                    {isMapExpanded ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />} 
                    {isMapExpanded ? "Perkecil Peta" : "Perbesar Peta"}
                  </Button>
                  <a href={task.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-accent border-accent/30"><ExternalLink className="w-4 h-4 mr-2"/> Buka G-Maps</Button>
                  </a>
                </div>
                <div className={`w-full rounded-xl overflow-hidden border border-border transition-all duration-300 ${isMapExpanded ? "h-[400px]" : "h-48"}`}>
                  <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" src={`https://maps.google.com/maps?q=$${task.latitude},${task.longitude}&z=16&output=embed`} />
                </div>
              </div>
            ) : (
              <div className="h-24 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">Titik Maps tidak tersedia</div>
            )}
          </div>
        </div>

        {/* INFO PELANGGAN & WA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-6 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 border-b border-border pb-2"><User className="w-4 h-4" /> Kontak Pelanggan</h4>
            <p className="font-bold text-lg flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" /> {task.phone}</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="block mt-2">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10"><MessageSquare className="w-4 h-4 mr-2"/> Chat WhatsApp</Button>
            </a>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 border-b border-border pb-2"><Key className="w-4 h-4 text-accent" /> Paket Layanan</h4>
            <p className="font-extrabold text-accent text-xl">{task.package?.name}</p>
            <p className="text-sm text-foreground uppercase">{task.buildingType} - {task.ownershipStatus?.replace('_',' ')}</p>
          </div>
        </div>

        {/* TOMBOL AKSI RAKSASA */}
        <div className="pt-6 border-t border-border">
          {isCompleted || task.accessToken ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-emerald-500">Instalasi Selesai</h3>
              <p className="text-sm text-muted-foreground">Token Akses Pelanggan:</p>
              <div className="inline-block bg-background border border-border px-6 py-3 rounded-lg text-xl font-mono font-bold text-foreground tracking-widest mt-2">
                {task.accessToken || "USER-TOKEN"}
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => onComplete(task.id)} 
              disabled={isProcessing}
              className="w-full h-16 text-lg font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Key className="w-6 h-6 mr-3" />}
              KLIK JIKA INSTALASI SUDAH SELESAI & MENYALA
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}