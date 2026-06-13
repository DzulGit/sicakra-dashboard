"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

// Impor komponen pecahan yang udah kita buat di atas
import { TasksHeader } from "./tasks-header";
import { TasksTable } from "./tasks-table";
import { fetchTasks, completeTaskAndGenerateToken, Task } from "@/lib/tasks";

export function TicketsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [actionId, setActionId] = useState<string | null>(null);

  // FETCH DATA: Ambil data dari API
  const { data: tasks, error, isLoading, mutate } = useSWR(
    'tasksList',
    () => fetchTasks() // Pastikan fetchTasks di lib lu me-request data dengan status ASSIGNED & COMPLETED
  );

  // FUNGSI UTAMA TEKNISI (Selesaikan Pemasangan & Buat Akun)
  const handleCompleteTask = async (id: string) => {
    if (!confirm("Konfirmasi: Apakah instalasi jaringan di lokasi pelanggan ini sudah selesai dan menyala?")) return;
    
    setActionId(id);
    const isSuccess = await completeTaskAndGenerateToken(id);
    if (isSuccess) {
      alert("Instalasi Selesai! Akun pelanggan berhasil dibuat.");
      mutate(); 
    } else {
      alert("Gagal memproses penyelesaian tugas. Cek koneksi server.");
    }
    setActionId(null);
  };

  // State Loading & Error
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm font-medium">Sinkronisasi data tugas teknisi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500 font-medium bg-rose-500/10 rounded-xl border border-rose-500/20">
        <span>Gagal memuat modul teknis. Pastikan server API merespons.</span>
      </div>
    );
  }

  // FILTER LOGIC
  const filteredTasks = (tasks || []).filter((task: Task) => {
    const matchesSearch =
      task.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || task.status === selectedFilter;
    
    // Jangan tampilkan PENDING atau REJECTED di halaman tugas teknisi
    const isValidRoleStatus = task.status === "ASSIGNED" || task.status === "COMPLETED";

    return matchesSearch && matchesFilter && isValidRoleStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Komponen Header & Filter */}
      <TasksHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      {/* 2. Komponen Tabel Utama */}
      <TasksTable 
        tasks={filteredTasks} 
        actionId={actionId} 
        onCompleteTask={handleCompleteTask} 
      />
    </div>
  );
}