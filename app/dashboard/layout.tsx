"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useSession } from "@clerk/nextjs" // 👈 1. Ganti menjadi useSession
import type { AdminRole } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<any>("overview")
  const [collapsed, setCollapsed] = useState(false)

  // 🔐 2. Ambil session aktif untuk membaca JWT Claims Token
  const { session } = useSession()
  
  // 3. Baca metadata role langsung dari claims (Sama persis dengan server-side)
  const userRole = ((session as any)?.claims?.metadata?.role || "OPERASIONAL") as AdminRole

  // 🛠️ DEBUGGING: Buka F12 (Inspect Element) di browser lu untuk mastiin string role dari Clerk
  console.log("INFO-SICAKRA: Role terdeteksi di browser saat ini ->", userRole);

  return (
    <div className="flex min-h-screen w-full bg-background">
      
      {/* SIDEBAR ASLI LU (TIDAK BERUBAH) */}
      <Sidebar 
        role={userRole} // 👈 Sekarang filtrasinya dijamin akurat mengikuti session token
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />
      
      <div 
        className={`flex flex-col flex-1 w-full transition-all duration-300 ${
          collapsed ? "md:pl-[70px]" : "md:pl-[240px] lg:pl-[260px]"
        }`}
      >
        <Header 
          activeSection={activeSection}
        />
        
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
      
    </div>
  )
}