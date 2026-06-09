import { useState } from "react";

export function useFinance(initialInvoices: any[] = [], onRefresh?: () => void) {
  
  // State untuk data tagihan dan filter status di UI
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // 🧠 LOGIKA SAKTI: Menghitung keterlambatan & menentukan tingkat warna peringatan
  const getOverdueStatus = (dueDateString: string, status: string) => {
    if (status === "PAID") {
      return { daysLate: 0, level: "CLEAN", text: "Lunas", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset jam agar kalkulasi hari akurat
    
    const dueDate = new Date(dueDateString);
    dueDate.setHours(0, 0, 0, 0);

    // Hitung selisih hari
    const diffTime = today.getTime() - dueDate.getTime();
    const daysLate = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Jika belum melewati tanggal jatuh tempo
    if (daysLate <= 0) {
      return {
        daysLate: 0,
        level: "CLEAN",
        text: "Belum Bayar",
        className: "bg-blue-500/10 text-blue-500 border-blue-500/20"
      };
    }

    // 🟡 Telat 1 - 5 hari: KUNING (Masih Oke)
    if (daysLate <= 5) {
      return {
        daysLate,
        level: "YELLOW",
        text: `Telat ${daysLate} Hari (Peringatan I)`,
        className: "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
      };
    }

    // 🟠 Lewat 5 hari sampai 10 hari: ORANGE
    if (daysLate <= 10) {
      return {
        daysLate,
        level: "ORANGE",
        text: `Telat ${daysLate} Hari (Peringatan II)`,
        className: "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.15)] animate-pulse"
      };
    }

    // 🔴 Lewat 10 hari (masuk ke 15 hari ke atas): MERAH (Kritis)
    return {
      daysLate,
      level: "RED",
      text: `Telat ${daysLate} Hari (⚠️ Blokir Profil)`,
      className: "bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold shadow-[0_0_15px_rgba(244,63,94,0.25)]"
    };
  };

  // Fungsi pembantu untuk memicu pesan WhatsApp pengingat tagihan manual jika diperlukan
  const sendWhatsAppReminder = (invoice: any) => {
    const overdueDetails = getOverdueStatus(invoice.dueDate, invoice.status);
    
    let formattedPhone = invoice.user?.phone || invoice.customerPhone || "";
    formattedPhone = formattedPhone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }

    const message = `Halo Kak *${invoice.user?.fullName || "Pelanggan Sicakra"}*,\n\n` +
      `Kami ingin menginfokan bahwa tagihan internet Sicakra WiFi Kakak untuk periode ini telah melewati jatuh tempo selama *${overdueDetails.daysLate} hari*.\n\n` +
      `• *Total Tagihan*: Rp ${(invoice.amount || 0).toLocaleString("id-ID")}\n` +
      `• *Link Pembayaran Resmi*: ${invoice.paymentUrl || "Cek di Aplikasi"}\n\n` +
      `Mohon lakukan pembayaran agar kenyamanan berinternet Kakak tidak terganggu. Terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`, '_blank');
  };

  return {
    invoices,
    setInvoices,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    getOverdueStatus,
    sendWhatsAppReminder
  };
}