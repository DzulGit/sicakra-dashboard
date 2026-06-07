"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<any>("overview")
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-background">
      
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />
      
      {/* KUNCINYA DI SINI: 
        Kita pakai padding-left (pl) untuk ngedorong konten. 
        Kalau collapsed (dilipat) paddingnya 80px, kalau kebuka paddingnya 280px.
      */}
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