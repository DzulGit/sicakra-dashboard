"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { getAdmin } from '@/lib/auth'
import type { AdminRole } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<any>("overview")
  const [collapsed, setCollapsed] = useState(false)

  const [userRole, setUserRole] = useState<AdminRole>("OPERASIONAL")

  useEffect(() => {
    const admin = getAdmin()
    if (admin && admin.role) {
      setUserRole(admin.role as AdminRole)
    }
  }, [])

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