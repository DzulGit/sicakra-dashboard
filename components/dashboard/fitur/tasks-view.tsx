"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Wrench, Search, MapPin, Key, Copy, Check, Loader2 } from "lucide-react";
import { fetchTasks, completeTaskAndGenerateToken, Task } from "@/lib/tasks";

export function TicketsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // 🔥 Ambil data asli terintegrasi dari backend
  const { data: tasks, error, isLoading, mutate } = useSWR(
    'tasksList',
    () => fetchTasks()
  );

  // ⚡ Handler untuk menyelesaikan tugas & generate token di DB
  const handleCompleteTask = async (id: string) => {
    setActionId(id);
    const updatedTask = await completeTaskAndGenerateToken(id);
    if (updatedTask) {
      mutate(); // 🔥 Detik itu juga UI langsung sinkron terupdate!
    } else {
      alert("Gagal memproses tugas lapangan. Cek controller NestJS lu bos!");
    }
    setActionId(null);
  };

  // Fungsi Copy Token ke Clipboard laptop
  const handleCopyToken = (token: string, taskId: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(taskId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Sinkronisasi tugas teknisi lapangan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500 font-medium">
        <span>Gagal terhubung ke modul teknis api server.</span>
      </div>
    );
  }

  const filteredTasks = (tasks || []).filter(
    (item: Task) =>
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.taskNum.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Fitur */}
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Wrench className="w-5 h-5 text-accent" />
          <span>Manajemen Instalasi & Token Aktivasi</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pantau penugasan teknisi, selesaikan pemasangan alat, dan generate token aktivasi pelanggan.
        </p>
      </div>

      {/* Bar Pencarian */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama pelanggan atau nomor tugas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-sidebar border border-sidebar-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
        />
      </div>

      {/* Grid Kartu Tugas Lapangan Real dari Database */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task: Task) => {
            return (
              <div 
                key={task.id} 
                className="bg-sidebar border border-sidebar-border rounded-xl p-5 hover:border-accent/40 transition-all duration-300 shadow-sm flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Atas Card */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono font-bold text-accent">{task.taskNum}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      task.status === "SELESAI" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Info Utama */}
                  <h3 className="font-bold text-sidebar-foreground text-sm group-hover:text-foreground transition-colors">
                    {task.customerName}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{task.packageName}</p>
                  
                  {/* Alamat */}
                  <div className="flex items-start gap-1.5 mt-3 text-xs text-muted-foreground bg-sidebar-accent/20 p-2.5 rounded-lg border border-sidebar-border/50">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2 leading-relaxed">{task.address}</span>
                  </div>
                </div>

                {/* Bagian Bawah: Generator Token & Logika Status */}
                <div className="mt-6 pt-4 border-t border-sidebar-border">
                  {task.activationToken ? (
                    /* Tampilan Jika Token Sudah Tergenerate */
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block"> Token Aktivasi Router </label>
                      <div className="flex items-center gap-1 bg-background border border-border p-2 rounded-lg h-9 font-mono text-xs text-emerald-400 justify-between">
                        <span className="truncate pr-2">{task.activationToken}</span>
                        <button 
                          onClick={() => handleCopyToken(task.activationToken!, task.id)}
                          className="p-1 hover:bg-sidebar-accent rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                          {copiedId === task.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Tombol Aksi Jika Status Masih Proses */
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(task.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </span>
                      <button 
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={actionId === task.id}
                        className="h-8 px-3 bg-primary text-primary-foreground font-bold rounded-lg text-[11px] flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm shrink-0 disabled:opacity-50"
                      >
                        {actionId === task.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                        <span>Selesaikan & Generate</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10 bg-sidebar border border-sidebar-border rounded-xl">
            <p className="text-sm text-sidebar-foreground font-medium">Tidak ada tugas instalasi aktif di database.</p>
          </div>
        )}
      </div>

    </div>
  );
}