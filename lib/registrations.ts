const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/registrations`;

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
  status: "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED" | "COMPLETED";
  rejectReason?: string;
  createdAt: string;
}

// 🔥 HAPUS PARAMETER TOKEN, GANTI PAKE CREDENTIALS
export async function fetchRegistrations(status?: string): Promise<Registration[]> {
  const url = status ? `${API_URL}?status=${status}` : API_URL;
  
  try {
    const res = await fetch(url, {
      // ⚡ Ini kuncinya biar browser otomatis ngirim cookie sicakra_session
      credentials: "include", 
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

// Tambahkan parameter 'action' di fungsinya
export async function processRegistration(id: string, action: "APPROVED" | "REJECTED", data: any) {
  // 🔥 AUTO SWITCH ROUTE: Kalo disetujui lari ke /assign, kalo ditolak lari ke /reject
  const route = action === "APPROVED" ? "assign" : "reject";
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/registrations/${id}/${route}`;

  const res = await fetch(endpoint, {
    method: "PATCH", // Backend lu pake @Patch, udah bener!
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }
  
  return res.json();
}