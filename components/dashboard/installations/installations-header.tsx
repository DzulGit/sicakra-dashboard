"use client";

import React from "react";
import { Search, Filter, Wrench, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstallationsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export function InstallationsHeader({ searchQuery, setSearchQuery, selectedFilter, setSelectedFilter }: InstallationsHeaderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Wrench className="w-5 h-5 text-accent" />
          <span>Manajemen Instalasi Layanan Tambahan</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Daftar aktivasi pasang baru untuk pelanggan lama yang menambah layanan.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari ID atau nama pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg border border-border">
            {["all", "APPROVED", "COMPLETED"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  selectedFilter === filter
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {filter === "all" ? "Semua" : filter === "APPROVED" ? "Proses Instalasi" : "Selesai"}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground hover:text-foreground border border-border transition-colors duration-200">
          <Filter className="w-4 h-4" />
          Filter Lanjutan
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}