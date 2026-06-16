"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function RequestsView() {
  // Tambahkan handling error agar Fetch melempar error jika res.ok bernilai false
  const fetcher = async (url: string) => {
    try {
      const res = await fetch(`${API_URL}${url}`, { credentials: 'include' });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`🚨 Error API (${res.status}):`, errorText);
        throw new Error("Gagal mengambil data");
      }
      return await res.json();
    } catch (err) {
      console.error("🚨 Error Fetcher:", err);
      throw err;
    }
  };
  
  const { data: requests, error, isLoading, mutate } = useSWR('/admin/service-requests', fetcher);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Fallback pengaman untuk memastikan tipe data adalah Array
  const requestList = Array.isArray(requests) ? requests : (requests?.data || []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`Yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pengajuan ini?`)) return;
    
    setLoadingAction(id);
    try {
      const res = await fetch(`${API_URL}/admin/service-requests/${id}/${action}`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error("Gagal proses");
      mutate();
    } catch (error) {
      alert("Gagal memproses pengajuan.");
    } finally {
      setLoadingAction(null);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  if (error) return <div className="text-red-500">Gagal memuat data pengajuan.</div>;

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="px-6 py-4">Pelanggan</th>
              <th className="px-6 py-4">Tipe Pengajuan</th>
              <th className="px-6 py-4">Detail Perubahan</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requestList.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada pengajuan.</td></tr>
            ) : (
              requestList.map((req: any) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{req.user?.fullName}</div>
                    <div className="text-xs text-gray-500">{req.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {req.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {req.newPackageId && <div>Paket Baru: {req.newPackageId}</div>}
                    {req.newAddress && <div>Alamat Baru: {req.newAddress}</div>}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      req.status === 'PENDING' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                      req.status === 'APPROVED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      'bg-red-50 text-red-700 ring-red-600/10'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {req.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAction(req.id, 'approve')}
                          disabled={loadingAction === req.id}
                          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
                        >
                          {loadingAction === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-1 h-4 w-4" />} Setujui
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'reject')}
                          disabled={loadingAction === req.id}
                          className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {loadingAction === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="mr-1 h-4 w-4 text-red-500" />} Tolak
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}