const API_URL = "http://localhost:3000/tasks";

export interface Task {
  id: string;
  taskNum: string;
  customerName: string;
  packageName: string;
  address: string;
  status: "PROSES" | "SELESAI";
  activationToken?: string;
  createdAt: string;
}

// 1. Fetch data tugas lapangan asli dari NestJS
export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch(API_URL, {
      credentials: "include", // 🔥 WAJIB COOKIE
    });
    if (!res.ok) return [];
    
    const text = await res.text();
    if (!text || text.trim() === "") return [];

    const responseData = JSON.parse(text);
    return responseData.data || responseData || [];
  } catch (error) {
    console.error("Gagal nge-fetch tugas lapangan:", error);
    return [];
  }
}

// 2. Aksi selesaikan pemasangan sekaligus generate token di backend
export async function completeTaskAndGenerateToken(id: string): Promise<Task | null> {
  try {
    const res = await fetch(`${API_URL}/${id}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal menyelesaikan tugas:", error);
    return null;
  }
}