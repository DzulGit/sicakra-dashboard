"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

// Import komponen-komponen lu
import { TasksHeader } from "./tasks-header";
import { TasksTable } from "./tasks-table"; // 👉 Pastikan lu pake task-table atau tasks-table (sesuai nama file lu ya)
import { TaskDetailPanel } from "./tasks-detail-panel"; // 👉 Pake 's' karena nama file lu tasks-detail-panel.tsx
import { fetchTasks, completeTaskAndGenerateToken, Task } from "@/lib/tasks";

export function TicketsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [actionId, setActionId] = useState<string | null>(null);
  
  // State buat Slide-Over Detail
  const [selectedTask, setSelectedTask] = useState<any>(null); 

  const { data: tasks, error, isLoading, mutate } = useSWR('tasksList', () => fetchTasks());

  const handleCompleteTask = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    if (!confirm("Konfirmasi: Apakah instalasi jaringan di lokasi pelanggan ini sudah selesai dan menyala?")) return;
    
    setActionId(id);
    try {
      const isSuccess = await completeTaskAndGenerateToken(id);
      if (isSuccess) {
        alert("Instalasi Selesai! Token berhasil dibuat.");
        mutate(); 
        
        if (selectedTask && selectedTask.id === id) {
          setSelectedTask({ ...selectedTask, status: "COMPLETED", accessToken: "MEMUAT..." });
        }
      } else {
        alert("Gagal memproses penyelesaian tugas. Cek koneksi server.");
      }
    } catch (err) {
      alert("Terjadi kendala sistem! Gagal menyelesaikan tugas.");
    } finally {
      setActionId(null); 
    }
  };

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
    const isValidRoleStatus = task.status === "ASSIGNED" || task.status === "COMPLETED";

    return matchesSearch && matchesFilter && isValidRoleStatus;
  });

  // RENDER CONDITIONAL PANEL SLIDE-OVER
  if (selectedTask) {
    return (
      <TaskDetailPanel 
        task={selectedTask}
        actionId={actionId}
        onClose={() => setSelectedTask(null)}
        onComplete={handleCompleteTask}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <TasksHeader 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}
      />
      <TasksTable 
        tasks={filteredTasks} 
        actionId={actionId} 
        onCompleteTask={handleCompleteTask}
        onSelectTask={setSelectedTask} 
      />
    </div>
  );
}   