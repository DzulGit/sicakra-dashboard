"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { InstallationsHeader } from "./installations-header";
import { InstallationsTable } from "./installations-table";
import { InstallationsDetailPanel } from "./installations-detail-panel";
import { fetchAllServiceRequests, completeServiceRequestTask, ServiceRequest } from "@/lib/service-requests";

export function InstallationsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null); 

  const { data: requests, error, mutate } = useSWR('installationsList', () => fetchAllServiceRequests());

  const handleCompleteTask = async (id: string) => {
    setActionId(id);
    try {
      const isSuccess = await completeServiceRequestTask(id);
      if (isSuccess) {
        alert("Instalasi Selesai! Layanan diaktifkan.");
        mutate();
        setSelectedTask((prev: any) => ({ ...prev, status: "COMPLETED" }));
      } else {
        alert("Gagal menyelesaikan instalasi. Pastikan backend merespons.");
      }
    } finally {
      setActionId(null);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500 font-medium bg-rose-500/10 rounded-xl border border-rose-500/20">
        <span>Gagal memuat data. Pastikan server API merespons.</span>
      </div>
    );
  }

  // Filter khusus TAMBAH_LANGGANAN yang sudah APPROVED atau COMPLETED
  const filteredTasks = (requests || []).filter((task: ServiceRequest) => {
    if (task.type !== "TAMBAH_LANGGANAN") return false;
    
    const isValidStatus = task.status === "APPROVED" || task.status === "COMPLETED";
    if (!isValidStatus) return false;

    const matchesSearch = 
      task.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || task.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  if (selectedTask) {
    return (
      <InstallationsDetailPanel 
        task={selectedTask}
        actionId={actionId}
        onClose={() => setSelectedTask(null)}
        onComplete={handleCompleteTask}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <InstallationsHeader 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}
      />
      <InstallationsTable 
        tasks={filteredTasks} 
        actionId={actionId}
        onSelectTask={setSelectedTask}
      />
    </div>
  );
}