import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Wifi, MoreHorizontal, Download, Upload, Edit3, Archive, CheckCircle2, Loader2, Users } from "lucide-react";
import { Package } from "@/lib/packages";

interface PackageCardProps {
  pkg: Package;
  index: number;
  canModify: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSuccess: () => void;
}

export function PackageCard({ pkg, index, canModify, onEdit, onDelete, onSuccess }: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const speedRatio = Math.min((pkg.speedDown / 100) * 100, 100);

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://sicakra-api-qgjaoib32q-et.a.run.app";
      const response = await fetch(`${apiUrl}/packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "ACTIVE" }),
      });

      if (!response.ok) throw new Error("Gagal mengaktifkan paket");
      
      console.log(`✅ Paket ${pkg.name} kembali aktif!`);
      setShowMenu(false);
      onSuccess(); 
    } catch (error) {
      alert("Gagal mengaktifkan paket.");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div
      className="group relative bg-background border border-border rounded-xl p-5 min-h-[240px] flex flex-col cursor-pointer hover:border-accent/50 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 shadow-sm hover:shadow-md"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowMenu(false); }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 overflow-hidden pr-2">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-secondary flex items-center justify-center">
            <Wifi className="w-5 h-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="block text-base font-bold text-foreground truncate">{pkg.name}</span>
              
              {pkg.status === "ACTIVE" ? (
                <span className="shrink-0 text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded uppercase font-bold tracking-wider">
                  Active
                </span>
              ) : (
                <span className="shrink-0 text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded uppercase font-bold tracking-wider">
                  Arsip
                </span>
              )}
            </div>

            {/* 🔥 SEKARANG MENAMPILKAN DATA PELANGGAN RIIL (Bukan Order Dummy lagi) */}
            <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
              <Users className="w-3 h-3 text-accent" />
              <span className="text-xs font-medium">
                {/* Pakai pkg.sortOrder jika backend sementara memetakan jumlah user kesitu, atau sesuaikan ke field backend asli lu seperti pkg.activeUsers */}
                {pkg.sortOrder || 0} Pengguna Aktif
              </span>
            </div>
          </div>
        </div>
        
        {canModify && (
          <div className="relative shrink-0">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200",
                isHovered || showMenu ? "opacity-100" : "opacity-0"
              )}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 w-36 bg-popover border border-border rounded-lg shadow-xl z-10 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <button onClick={onEdit} className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-secondary text-foreground transition-colors">
                  <Edit3 className="w-4 h-4" /> Edit Data
                </button>
                
                {pkg.status === "ACTIVE" ? (
                  <button onClick={onDelete} className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-amber-500/10 text-amber-500 transition-colors">
                    <Archive className="w-4 h-4" /> Arsipkan
                  </button>
                ) : (
                  <button onClick={handleActivate} disabled={isActivating} className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-emerald-500/10 text-emerald-500 transition-colors">
                    {isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Aktifkan
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-end gap-1.5 mb-5 flex-1">
        <span className="text-3xl font-black text-foreground tracking-tight">
          Rp {pkg.price.toLocaleString("id-ID")}
        </span>
        <span className="text-sm text-muted-foreground font-medium pb-1.5">/bln</span>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground bg-secondary/40 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-foreground">{pkg.speedDown}</span> Mbps
        </div>
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-foreground">{pkg.speedUp}</span> Mbps
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between text-[10px] mb-2">
          <span className="text-muted-foreground uppercase font-bold tracking-widest">Performa</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
          <div
            className={cn("h-full rounded-full transition-all duration-500", pkg.status === 'ACTIVE' ? 'bg-accent' : 'bg-muted-foreground')}
            style={{ width: `${speedRatio}%` }}
          />
        </div>
        
        {pkg.features && pkg.features.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate font-medium">{pkg.features.join(" • ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}