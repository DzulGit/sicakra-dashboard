"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Clock, CheckCircle2, Key, Copy, Check, Loader2, MapPin, Eye } from "lucide-react";

interface TasksTableProps {
  tasks: any[];
  actionId: string | null;
  onCompleteTask: (id: string, e?: React.MouseEvent) => void;
  onSelectTask: (task: any) => void;
}

export function TasksTable({ tasks, actionId, onCompleteTask, onSelectTask }: TasksTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 🔥 Tambahin event (e) biar klik copy gak ngebuka panel
  const handleCopyToken = (e: React.MouseEvent, token: string, taskId: string) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(token);
    setCopiedId(taskId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                  ID & Pelanggan <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lokasi Instalasi</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paket Layanan</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jadwal Survey</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Aksi / Token</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                const isCompleted = task.status === "COMPLETED";
                return (
                  <tr
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    // 🔥 Tambahin class "group" biar kita bisa bikin efek hover ke elemen di dalamnya
                    className="group border-b border-border last:border-0 hover:bg-secondary/40 transition-colors duration-200 cursor-pointer animate-in fade-in"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                  >
                    {/* Kolom 1: Pelanggan */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 mt-1 rounded-md bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground uppercase border border-border group-hover:bg-accent/10 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                          {task.fullName.charAt(0)}
                        </div>
                        <div>
                          {/* 🔥 SOLUSI UX: Munculin lencana "Lihat Detail" pas di-hover */}
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-foreground capitalize group-hover:text-accent transition-colors">{task.fullName}</p>
                            <span className="opacity-0 group-hover:opacity-100 transition-all text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold translate-x-[-10px] group-hover:translate-x-0">
                              <Eye className="w-3 h-3" /> Detail
                            </span>
                          </div>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">ID: {task.id.substring(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{task.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Lokasi */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start gap-1.5 max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground line-clamp-2 leading-snug">{task.address}</p>
                          <p className="text-xs text-muted-foreground mt-1">{task.city}</p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 3: Paket */}
                    <td className="py-4 px-4 align-top">
                      <span className="text-sm font-semibold text-accent tracking-tight">
                        {task.package?.name || "Custom"}
                      </span>
                    </td>

                    {/* Kolom 4: Jadwal Survey */}
                    <td className="py-4 px-4 align-top">
                      {task.surveyDate ? (
                        <>
                          <p className="text-sm font-medium text-foreground">{new Date(task.surveyDate).toLocaleDateString('id-ID')}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{task.surveyTime || "-"}</p>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Menunggu Jadwal</span>
                      )}
                    </td>

                    {/* Kolom 5: Status */}
                    <td className="py-4 px-4 align-top">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border",
                        isCompleted 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {isCompleted ? "Selesai" : "Proses"}
                      </div>
                    </td>

                    {/* Kolom 6: Action Button / Token Display */}
                    <td className="py-4 px-4 align-top text-right">
                      {isCompleted || task.accessToken ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            {task.accessToken || "USER-TOKEN"}
                          </span>
                          {task.accessToken && (
                            <button
                              onClick={(e) => handleCopyToken(e, task.accessToken, task.id)}
                              className="relative z-10 p-1.5 rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors border border-border"
                              title="Salin Token"
                            >
                              {copiedId === task.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          // 🔥 SOLUSI TOMBOL TUNTASKAN: e.preventDefault() ngunci klik biar gak nyebar!
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onCompleteTask(task.id, e);
                          }}
                          disabled={actionId === task.id}
                          className="relative z-10 inline-flex items-center justify-center gap-2 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
                        >
                          {actionId === task.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                          Tuntaskan
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                  Tidak ada penugasan lapangan yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}