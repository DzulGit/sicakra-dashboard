import React from "react";
import { Plus } from "lucide-react";
import { Package } from "@/lib/packages";
import { PackageCard } from "./package-card";

interface PackageBoardProps {
  activePackages: Package[];
  inactivePackages: Package[];
  canModify: boolean;
  onEdit: (pkg: Package) => void;
  onDelete: (pkg: Package) => void;
  onCreate: () => void;
}

export function PackageBoard({ activePackages, inactivePackages, canModify, onEdit, onDelete, onCreate }: PackageBoardProps) {
  const columns = [
    { id: "active", name: "Tersedia (Active)", deals: activePackages, total: activePackages.length },
    { id: "inactive", name: "Diarsipkan (Inactive)", deals: inactivePackages, total: inactivePackages.length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map((column, colIndex) => (
        <div
          key={column.id}
          className="bg-card border border-border rounded-xl p-4 min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col"
          style={{ animationDelay: `${colIndex * 100}ms`, animationFillMode: "both" }}
        >
          {/* Stage header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${column.id === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
              <h3 className="text-sm font-semibold text-foreground">{column.name}</h3>
            </div>
            <span className="px-2 py-0.5 bg-secondary rounded-md text-xs font-medium text-muted-foreground">
              {column.total} Paket
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-3 flex-1">
            {column.deals.map((pkg, index) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                index={index} 
                canModify={canModify}
                onEdit={() => onEdit(pkg)}
                onDelete={() => onDelete(pkg)}
              />
            ))}
            
            {column.deals.length === 0 && (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-xs text-muted-foreground">
                Kosong
              </div>
            )}
          </div>

          {/* Add Button at bottom of column */}
          {canModify && column.id === "active" && (
            <button 
              onClick={onCreate}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-secondary/50 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Tambah Paket
            </button>
          )}
        </div>
      ))}
    </div>
  );
}