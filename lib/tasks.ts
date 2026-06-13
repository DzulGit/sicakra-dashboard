const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/registrations`;

export interface Task {
  id: string;
  fullName: string;
  address: string;
  city: string;
  status: "PENDING" | "APPROVED" | "ASSIGNED" | "REJECTED" | "COMPLETED";
  accessToken?: string | null; // Kolom token asli dari schema prisma lu
  package: {
    name: string;
    price: number;
  };
  createdAt: string;
}

// 1. Ambil data tugas lapangan (Registrasi berstatus ASSIGNED atau COMPLETED)
export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch(API_URL, {
      credentials: "include", // Mengirim cookie sesi admin backend
    });
    
    if (!res.ok) return [];
    
    const text = await res.text();
    if (!text || text.trim() === "") return [];

    const responseData = JSON.parse(text);
    const data: Task[] = responseData.data || responseData || [];
    
    // Filter hanya menampilkan data yang sudah dideploy ke lapangan (ASSIGNED atau COMPLETED)
    return data.filter(task => task.status === "ASSIGNED" || task.status === "COMPLETED");
  } catch (error) {
    console.error("Error fetch data tugas lapangan:", error);
    return [];
  }
}

// 2. Kirim sinyal penyelesaian instalasi ke endpoint POST /registrations/:id/complete
export async function completeTaskAndGenerateToken(id: string): Promise<boolean> {
  console.log("[DEBUG 2] Mulai eksekusi completeTaskAndGenerateToken...");
  try {
    const targetUrl = `${API_URL}/${id}/complete`;
    console.log("[DEBUG 3] URL Target Fetch:", targetUrl);

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    console.log("[DEBUG 4] Fetch selesai. HTTP Status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[DEBUG ERROR] Pesan dari backend:", errorText);
    }

    return res.ok;
  } catch (error) {
    console.error("[DEBUG CATCH] Gagal melakukan request ke jaringan:", error);
    return false;
  }
}

