// Sesuaikan dengan PORT NestJS lu (misal 3000)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function loginAdmin(email: string, password: string, role: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
      // Kalo bukan JSON, kita ambil teks mentahnya aja biar gak crash
      const textData = await res.text();
      return { role: "DUMMY_SUCCESS_BYPASS", data: textData };
    }

    return await res.json();
  } catch (error: any) {
    // 🔥 INI DIA SENSORNYA: Biar keliatan di console log eror aslinya apa!
    console.error("🚨 DETEKTIF API ERROR:", error);
    throw error;
  }
}