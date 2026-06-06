// Sesuaikan dengan PORT NestJS lu (misal 3000)
const NESTJS_API_URL = "http://localhost:3000";

export async function loginAdmin(email: string, password: string, role: string) {
  const res = await fetch(`${NESTJS_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Pastikan role dikirim dan di-uppercase agar cocok dengan Enum Prisma
    body: JSON.stringify({ email, password, role: role.toUpperCase() }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal login");
  }

  return res.json();
}

export async function fetchSystemStatus() {
  const res = await fetch(`${NESTJS_API_URL}/system-status`);
  if (!res.ok) throw new Error("Gagal mengambil status");
  
  const data = await res.json();
  return data.status; // Array string untuk marquee
}