"use client";

import React from "react";
import { Clock, CheckCircle2, Eye, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstallationsTableProps {
  tasks: any[];
  actionId: string | null;
  onSelectTask: (task: any) => void;
}

export function InstallationsTable({ tasks, onSelectTask }: InstallationsTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID Pengajuan</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pelanggan</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alamat Pemasangan</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                const isCompleted = task.status === "COMPLETED";
                return (
                  <tr key={task.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="text-xs font-mono font-medium text-foreground">{task.id}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(task.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-semibold text-foreground">{task.user?.fullName}</div>
                      <div className="text-xs text-muted-foreground">{task.user?.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-muted-foreground max-w-[250px] truncate" title={task.newAddress}>
                        {task.newAddress}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                        isCompleted ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {isCompleted ? "Selesai" : "Proses"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask(task);
                        }}
                        className="relative z-10 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-secondary border border-border text-foreground text-xs font-bold hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail & Eksekusi
                        <ChevronRight className="w-3 h-3 ml-0.5 opacity-50" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                  Tidak ada penugasan instalasi layanan tambahan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}