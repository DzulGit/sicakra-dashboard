"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2, CheckCircle, XCircle, Inbox } from "lucide-react";
import { fetchAllServiceRequests, approveServiceRequest } from "@/lib/service-requests";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function RequestsView() {
  // Panggil data dari endpoint /all menggunakan helper dari lib
  const { data: requests, error, isLoading, mutate } = useSWR('allServiceRequests', () => fetchAllServiceRequests());
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const requestList = Array.isArray(requests) ? requests : [];

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`Yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pengajuan ini?`)) return;
    
    setLoadingAction(id);
    try {
      if (action === 'approve') {
        const isSuccess = await approveServiceRequest(id);
        if (!isSuccess) throw new Error("Gagal menyetujui");
      } else {
        // Asumsi backend punya endpoint /reject
        const res = await fetch(`${API_URL}/service-requests/${id}/reject`, {
          method: 'PATCH',
          credentials: 'include'
        });
        if (!res.ok) throw new Error("Gagal menolak");
      }
      mutate();
    } catch (error) {
      alert(`Gagal memproses pengajuan. Pastikan API merespons.`);
    } finally {
      setLoadingAction(null);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500 font-medium bg-rose-500/10 rounded-xl border border-rose-500/20">
        <span>Gagal memuat data pengajuan. Pastikan server API merespons.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Inbox className="w-5 h-5 text-accent" />
          <span>Pengajuan Layanan Pelanggan</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Kelola permintaan tambah langganan, ganti paket, atau pindah alamat dari pelanggan.
        </p>
      </div>

      {/* Tabel */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pelanggan</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipe Pengajuan</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detail Perubahan</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
                  </td>
                </tr>
              ) : requestList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    Tidak ada pengajuan yang masuk.
                  </td>
                </tr>
              ) : (
                requestList.map((req: any) => (
                  <tr key={req.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="text-sm font-semibold text-foreground">{req.user?.fullName}</div>
                      <div className="text-xs text-muted-foreground">{req.user?.email || req.user?.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                        {req.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {req.newPackageId && <div className="font-mono">Paket: {req.newPackageId}</div>}
                      {req.newAddress && <div className="truncate max-w-[200px]" title={req.newAddress}>Lokasi: {req.newAddress}</div>}
                      {req.reason && <div className="italic text-[10px] mt-1">Alasan: {req.reason}</div>}
                    </td>
                    <td className="py-3 px-4">
                       <div className="text-xs text-foreground">
                         {new Date(req.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                       </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        req.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        req.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        req.status === 'COMPLETED' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {req.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(req.id, 'approve')}
                            disabled={loadingAction === req.id}
                            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold disabled:opacity-50"
                          >
                            {loadingAction === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            Setujui
                          </button>
                          <button
                            onClick={() => handleAction(req.id, 'reject')}
                            disabled={loadingAction === req.id}
                            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold disabled:opacity-50"
                          >
                            {loadingAction === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}