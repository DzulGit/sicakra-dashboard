const API_URL = "http://localhost:3000/registrations";

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
  try {
    const res = await fetch(`${API_URL}/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error("Error menyelesaikan tugas pemasangan:", error);
    return false;
  }
}