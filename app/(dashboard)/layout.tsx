"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar"; // 🔥 Sudah diarahkan ke folder layout baru
import { Header } from "@/components/layout/header";   // 🔥 Sudah diarahkan ke folder layout baru
import { AdminRole } from "@/types";
import Cookies from "js-cookie";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [role, setRole] = useState<AdminRole>("OPERASIONAL");

  useEffect(() => {
    const savedRole = Cookies.get("sicakra_role") as AdminRole;
    if (savedRole) setRole(savedRole);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      
      {/* Sisi Kiri: Sidebar Mewah Lu */}
      <Sidebar 
        role={role} 
        collapsed={sidebarCollapsed} 
        onCollapsedChange={setSidebarCollapsed} 
      />

      {/* Sisi Kanan: Area Konten Utama */}
      <div 
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out"
        style={{ 
          paddingLeft: sidebarCollapsed ? "72px" : "260px" 
        }}
      >
        <Header title="Sicakra Workspace" />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}