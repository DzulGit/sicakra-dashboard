const API_URL = "http://localhost:3000/registrations";

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
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  
  if (!res.ok) throw new Error("Gagal mengambil data pendaftaran");
  
  const text = await res.text();
  if (!text) return [];
  
  const parsed = JSON.parse(text);
  
  // 👇 INI KUNCINYA: Kita intip apa sih isi asli dari backend lu!
  console.log("🚨 HASIL DARI BACKEND:", parsed); 
  
  // Kita coba tangkap semua kemungkinan format bungkusannya:
  if (Array.isArray(parsed)) return parsed; // Kalau langsung array
  if (parsed.data && Array.isArray(parsed.data)) return parsed.data; // Kalau dibungkus "data"
  if (parsed.items && Array.isArray(parsed.items)) return parsed.items; // Kalau dibungkus "items"
  if (parsed.result && Array.isArray(parsed.result)) return parsed.result; // Kalau dibungkus "result"
  
  return []; // Kalau gagal semua, balikin array kosong
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