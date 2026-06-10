const API_URL = "http://localhost:3000/invoices";

// Sesuaikan dengan Prisma Schema lu (biasanya backend lu nge-join data User)
export interface Invoice {
  id: string;
  invoiceNum: string;
  period: string;
  amount: number;
  status: "LUNAS" | "BELUM_DIBAYAR";
  paidAt?: string;
  user?: {
    fullName: string;
    phone: string;
  };
}

export async function fetchInvoices(): Promise<Invoice[]> {
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
    console.error("Gagal nge-fetch tagihan:", error);
    return [];
  }
}

export async function payInvoice(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${id}/pay`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}