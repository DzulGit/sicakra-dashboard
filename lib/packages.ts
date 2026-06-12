// Ambil URL dari Environment Variable, kalau gak ada otomatis fallback ke localhost
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/packages`;

// Tipe data Package sesuai Prisma Schema
export interface Package {
  id: string;
  name: string;
  description?: string;
  price: number;
  speedDown: number;
  speedUp: number;
  features: string[];
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder: number;
}

// 1. Fetch Semua Paket
export async function fetchPackages(): Promise<Package[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Gagal mengambil data paket");
  return res.json();
}

// 2. Tambah Paket Baru
export async function createPackage(data: Partial<Package>): Promise<Package> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal membuat paket");
  return res.json();
}

// 3. Update Paket
export async function updatePackage(id: string, data: Partial<Package>): Promise<Package> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal mengupdate paket");
  return res.json();
}

// 4. Hapus Paket (Soft Delete / Ubah Status)
export async function deletePackage(id: string): Promise<Package> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal menghapus paket");
  return res.json();
}