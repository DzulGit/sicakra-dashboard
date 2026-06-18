const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/service-requests`;

export interface ServiceRequest {
  id: string;
  userId: string;
  type: "TAMBAH_LANGGANAN" | "GANTI_PAKET" | "PINDAH_ALAMAT" | "PUTUS_LANGGANAN";
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  newPackageId?: string;
  newAddress?: string;
  reason?: string;
  createdAt: string;
  user?: {
    fullName: string;
    phone: string;
    email: string;
  };
}

// Mengambil semua data pengajuan untuk Admin
export async function fetchAllServiceRequests(): Promise<ServiceRequest[]> {
  try {
    const res = await fetch(`${API_URL}/all`, {
      credentials: "include",
    });
    
    if (!res.ok) return [];
    
    const text = await res.text();
    if (!text || text.trim() === "") return [];

    const responseData = JSON.parse(text);
    return responseData.data || responseData || [];
  } catch (error) {
    console.error("Error fetch service requests:", error);
    return [];
  }
}

// Admin Operasional: Setujui Pengajuan
export async function approveServiceRequest(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error("Error approve request:", error);
    return false;
  }
}

// Admin Teknis: Selesaikan Pemasangan
export async function completeServiceRequestTask(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${id}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error("Error complete request:", error);
    return false;
  }
}