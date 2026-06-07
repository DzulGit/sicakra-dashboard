const API_URL = "http://127.0.0.1:3000/registrations";

// 1. Sesuaikan Interface dengan Prisma Schema lu
export interface Registration {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  job: string;
  ktpNumber?: string;
  address: string;
  rtRw: string;
  village: string;
  district: string;
  city: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
  buildingType: string;
  ownershipStatus: string;
  packageId: string;
  package?: {
    name: string;
    price: number;
  };
  surveyDate?: string;
  surveyTime?: string;
  notes?: string;
  ktpPhotoUrl?: string;
  housePhotoUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason?: string;
  createdAt: string;
}

export async function fetchRegistrations(token: string, status?: string): Promise<Registration[]> {
  const url = status ? `${API_URL}?status=${status}` : API_URL;
  
  try {
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    // 1. KITA BACA RAW TEKSNYA DULU (Biar kebal dari error JSON)
    const text = await res.text();
    console.log("🚨 TEKS ASLI DARI BACKEND:", text); // 👈 Cek console browser nanti!
    
    // Kalau error dari backend (misal 401, 500)
    if (!res.ok) {
      console.error("Backend Error Status:", res.status);
      return []; 
    }
    
    // Kalau backend ngirim kosong melompong
    if (!text || text.trim() === "") {
      console.warn("Peringatan: Backend tidak mengirim data apa-apa (Blank)!");
      return [];
    }

    // Kalau aman, baru kita parse
    const responseData = JSON.parse(text);
    return responseData.data || responseData || []; 
    
  } catch (error) {
    console.error("Gagal nge-fetch atau parse:", error);
    return [];
  }
}

export async function processRegistration(
  token: string,
  id: string, 
  data: { status: "APPROVED" | "REJECTED"; rejectReason?: string; surveyDate?: string; surveyTime?: string }
): Promise<Registration | null> {
  const res = await fetch(`${API_URL}/${id}/process`, {
    method: "PATCH", 
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal memproses pendaftaran");
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}