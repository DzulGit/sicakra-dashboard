// Sesuaikan dengan PORT NestJS lu (misal 3000)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function loginAdmin(email: string, password: string, role: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Include credentials so browser accepts Set-Cookie from backend
      credentials: "include",
      // Pastikan role dikirim dan di-uppercase agar cocok dengan Enum Prisma
      body: JSON.stringify({ email, password, role: role.toUpperCase() }),
    });

    // 1. Kalo backend ngamuk (400, 401, 404, 500, dll)
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Gagal login tanpa pesan JSON" }));
      throw new Error(errorData.message || `Eror server dengan status: ${res.status}`);
    }

    // 2. Antisipasi kalo backend sukses (201) tapi bodinya kosong/bukan JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textData = await res.text();
      return { role: "DUMMY_SUCCESS_BYPASS", data: textData };
    }

    return await res.json();
  } catch (error: any) {
    // 🔥 INI DIA SENSORNYA
    console.error("🚨 DETEKTIF API ERROR:", error);
    throw error;
  }
}

// 🔥 INI FUNGSI YANG TADI ILANG KETIMPA:
export async function fetchSystemStatus() {
  const res = await fetch(`${API_URL}/system-status`);
  if (!res.ok) throw new Error("Gagal mengambil status");
  
  const data = await res.json();
  return data.status; // Array string untuk marquee
}