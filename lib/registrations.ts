const API_URL = "http://localhost:3000/registrations"; // Sesuaikan URL backend lu

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  nik: string;
  mapsUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  packageId: string;
  package?: {
    name: string;
    price: number;
  };
}

// Tambahkan parameter token
export async function fetchRegistrations(token: string, status?: string): Promise<Registration[]> {
  const url = status ? `${API_URL}?status=${status}` : API_URL;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}` // Masukin token Clerk ke sini
    }
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`🚨 Backend Error (${res.status}):`, errorText);
    throw new Error("Gagal mengambil data pendaftaran");
  }
  
  return res.json();
}

// Tambahkan parameter token juga di sini
export async function processRegistration(
  token: string,
  id: string, 
  data: { status: "APPROVED" | "REJECTED"; notes?: string; surveyDate?: string }
): Promise<Registration> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH", 
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Masukin token Clerk ke sini
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal memproses pendaftaran");
  return res.json();
}