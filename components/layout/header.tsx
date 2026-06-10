"use client";

import { cn } from "@/lib/utils";
import { Bell, Search, Calendar, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clearAuth } from "@/lib/auth";
import Cookies from "js-cookie"; // 🔥 Kita pakai ini buat ambil nama admin secara aman

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Dashboard" }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil nama dari cookie pas komponen dimuat di client side
  useEffect(() => {
    const name = Cookies.get("sicakra_name");
    if (name) setAdminName(name);

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // ⚡ DISESUAIKAN: Menembak API route group auth yang baru
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Gagal hit API logout:", error);
    }

    // Bersihkan sesi client-side bawaan fungsi lu
    clearAuth();
    localStorage.clear();
    sessionStorage.clear();

    // Tendang mutlak ke halaman login
    window.location.replace("/login");
  };

  // Otomatis bikin inisial dari nama (Contoh: Zulal Hafizh -> ZU, fallback ke "JD")
  const initials = adminName
    ? adminName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "JD";

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
      
      {/* Bagian Kiri (Title) — 100% UI Kebanggaan Lu */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-foreground">
          {title}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Bagian Kanan — 100% UI Kebanggaan Lu */}
      <div className="flex items-center gap-4">
        
        {/* Search */}
        <div
          className={cn(
            "relative flex items-center transition-all duration-300",
            searchFocused ? "w-64" : "w-48"
          )}
        >
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>

        {/* User avatar dengan Dropdown */}
        <div className="relative flex items-center" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-lg overflow-hidden bg-secondary ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200"
          >
            {/* Sekarang inisialnya dinamis membaca state */}
            <div className="w-full h-full bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-xs font-semibold text-accent-foreground">
              {initials}
            </div>
          </button>

          {/* Menu Dropdown Logout */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-[120%] w-48 bg-background border border-border rounded-lg shadow-lg py-1 animate-in fade-in slide-in-from-top-2">
              {/* Tambahan Info Akun yang Sedang Login */}
              <div className="px-4 py-2 border-b border-border/60">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Petugas</p>
                <p className="text-xs font-medium text-foreground truncate mt-0.5">{adminName}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Sistem</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}