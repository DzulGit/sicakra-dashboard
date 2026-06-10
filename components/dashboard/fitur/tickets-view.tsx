"use client";

import React, { useState } from "react";
import { Wrench, Search, MapPin, CheckCircle2, Key, Copy, Check } from "lucide-react";

export function TicketsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // State untuk menyimpan token yang berhasil di-generate per tiket
  const [generatedTokens, setGeneratedTokens] = useState<Record<string, string>>({});
  // State untuk melacak tiket mana yang statusnya diubah ke SELESAI
  const [ticketStatuses, setTicketStatuses] = useState<Record<string, string>>({
    "TKT-001": "PROSES",
    "TKT-002": "PROSES",
    "TKT-003": "SELESAI",
  });

  // Data Dummy Tugas Instalasi Lapangan Sicakra
  const dummyTickets = [
    { id: "TKT-001", customer: "Zulal Hafizh", package: "Sicakra Home - 20 Mbps", address: "Jl. Kaliurang KM 10, Sleman", date: "Hari Ini • 14:00" },
    { id: "TKT-002", customer: "Budi Santoso", package: "Sicakra Gamers - 50 Mbps", address: "Bantul Indah Blok C2, Bantul", date: "Hari Ini • 10:30" },
    { id: "TKT-003", customer: "Siti Rahma", package: "Sicakra Business - 100 Mbps", address: "Gondokusuman, Kota Yogyakarta", date: "Kemarin • 16:00" },
  ];

  // Fungsi Enkripsi Dummy untuk Generate Token Akses Instalasi
  const handleGenerateToken = (ticketId: string) => {
    // Pola token: SCK-[ID]-[RANDOM STRING STRING]-X
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const secureToken = `SCK-${ticketId}-${randomHex}-NET`;
    
    // Update token dan ubah status tiket menjadi SELESAI
    setGeneratedTokens(prev => ({ ...prev, [ticketId]: secureToken }));
    setTicketStatuses(prev => ({ ...prev, [ticketId]: "SELESAI" }));
  };

  // Fungsi Copy Token ke Clipboard laptop
  const handleCopyToken = (token: string, ticketId: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTickets = dummyTickets.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Fitur */}
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Wrench className="w-5 h-5 text-accent" />
          <span>Manajemen Instalasi & Token</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Selesaikan pemasangan alat di lokasi pelanggan dan dapatkan token aktivasi jaringan.
        </p>
      </div>

      {/* Bar Pencarian */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama pelanggan atau ID tugas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-sidebar border border-sidebar-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
        />
      </div>

      {/* Grid Kartu Tugas Lapangan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTickets.map((ticket) => {
          const status = ticketStatuses[ticket.id];
          const token = generatedTokens[ticket.id] || (ticket.id === "TKT-003" ? "SCK-TKT-003-E9A2BF-NET" : null);

          return (
            <div 
              key={ticket.id} 
              className="bg-sidebar border border-sidebar-border rounded-xl p-5 hover:border-accent/40 transition-all duration-300 shadow-sm flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Atas Card */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono font-bold text-accent">{ticket.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    status === "SELESAI" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {status}
                  </span>
                </div>

                {/* Info Utama */}
                <h3 className="font-bold text-sidebar-foreground text-sm group-hover:text-foreground transition-colors">
                  {ticket.customer}
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{ticket.package}</p>
                
                {/* Alamat */}
                <div className="flex items-start gap-1.5 mt-3 text-xs text-muted-foreground bg-sidebar-accent/20 p-2.5 rounded-lg border border-sidebar-border/50">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="line-clamp-2 leading-relaxed">{ticket.address}</span>
                </div>
              </div>

              {/* Bagian Bawah: Generator Token & Logika Status */}
              <div className="mt-6 pt-4 border-t border-sidebar-border">
                {token ? (
                  /* Tampilan Jika Token Sudah Tergenerate */
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block"> Token Aktivitas Router </label>
                    <div className="flex items-center gap-1 bg-background border border-border p-2 rounded-lg h-9 font-mono text-xs text-emerald-400 justify-between">
                      <span className="truncate pr-2">{token}</span>
                      <button 
                        onClick={() => handleCopyToken(token, ticket.id)}
                        className="p-1 hover:bg-sidebar-accent rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        title="Salin Token"
                      >
                        {copiedId === ticket.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Tombol Aksi Jika Status Masih Proses */
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">{ticket.date}</span>
                    <button 
                      onClick={() => handleGenerateToken(ticket.id)}
                      className="h-8 px-3 bg-primary text-primary-foreground font-bold rounded-lg text-[11px] flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm shrink-0"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Selesaikan & Token</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}