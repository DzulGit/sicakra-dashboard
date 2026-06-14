import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Wifi, MoreHorizontal, Download, Upload, Edit3, Trash2, CheckCircle2 } from "lucide-react";
import { Package } from "@/lib/packages";

interface PackageCardProps {
  pkg: Package;
  index: number;
  canModify: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function PackageCard({ pkg, index, canModify, onEdit, onDelete }: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Kalkulasi bar kecepatan (Misal max acuan 100Mbps untuk UI bar)
  const speedRatio = Math.min((pkg.speedDown / 100) * 100, 100);

  return (
    <div
      className="group relative bg-background border border-border rounded-lg p-4 cursor-pointer hover:border-accent/50 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 shadow-sm hover:shadow-md"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowMenu(false); }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
            <Wifi className="w-4 h-4 text-accent" />
          </div>
          <div>
            <span className="block text-sm font-bold text-foreground truncate max-w-[140px]">{pkg.name}</span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">Order: {pkg.sortOrder}</span>
          </div>
        </div>
        
        {/* Dropdown Action Menu */}
        {canModify && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={cn(
                "w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200",
                isHovered || showMenu ? "opacity-100" : "opacity-0"
              )}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-popover border border-border rounded-md shadow-lg z-10 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <button onClick={onEdit} className="w-full px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-secondary text-foreground transition-colors">
                  <Edit3 className="w-3 h-3" /> Edit Data
                </button>
                <button onClick={onDelete} className="w-full px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-rose-500/10 text-rose-500 transition-colors">
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-end gap-1 mb-4">
        <span className="text-lg font-extrabold text-foreground tracking-tight">
          Rp {pkg.price.toLocaleString("id-ID")}
        </span>
        <span className="text-xs text-muted-foreground font-medium pb-1">/bln</span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/50 p-2 rounded-md">
        <div className="flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium text-foreground">{pkg.speedDown}</span> Mbps
        </div>
        <div className="flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-medium text-foreground">{pkg.speedUp}</span> Mbps
        </div>
      </div>

      {/* Visual Indicator (Menggantikan Probability Bar) */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-[10px] mb-1.5">
          <span className="text-muted-foreground uppercase font-semibold tracking-wider">Performa</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", pkg.status === 'ACTIVE' ? 'bg-accent' : 'bg-muted-foreground')}
            style={{ width: `${speedRatio}%` }}
          />
        </div>
      </div>
      
      {/* Fitur Utama */}
      {pkg.features && pkg.features.length > 0 && (
        <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground truncate">
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          <span className="truncate">{pkg.features.join(" • ")}</span>
        </div>
      )}
    </div>
  );
}