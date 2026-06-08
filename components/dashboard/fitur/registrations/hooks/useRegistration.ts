import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

// 💡 TIPS: Jangan lupa sesuaikan import fungsi API lu di sini jika ada file terpisah,
// misal: import { processRegistration } from "@/lib/api";
// Sementara gua anggap fungsinya di-pass atau dipanggil langsung.

export function useRegistration(initialData: any[] = [], loadDataFromPage?: () => void) {
  const { getToken } = useAuth();
  
  // State manajemen terpusat untuk data pendaftaran
  const [data, setData] = useState<any[]>(initialData);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Fungsi untuk memproses persetujuan (APPROVED) atau penolakan (REJECTED)
  const handleProcess = async (status: "APPROVED" | "REJECTED", apiProcessFn: Function) => {
    if (!selectedReg) return;
    
    // Validasi input alasan jika statusnya REJECTED
    if (status === "REJECTED" && !rejectReason.trim()) {
      alert("Alasan penolakan wajib diisi!");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Ambil token asimetris dari Clerk
      const token = await getToken({ template: 'nestjs' });

      // 2. Jalankan fungsi API dari backend NestJS
      const response = await apiProcessFn(token || "", selectedReg.id, { 
        status: status,
        rejectReason: status === "REJECTED" ? rejectReason : undefined 
      });

      // 3. LOGIKA OTOMATISASI WHATSAPP JIKA STATUS = APPROVED
      if (status === "APPROVED" && response) {
        const voucherToken = response.accessToken || response.data?.accessToken || "TOKEN-ERROR";
        const userPassword = selectedReg.phone; // Nomor WA otomatis jadi password sementara
        
        // Bersihkan format nomor HP tujuan (Ubah 0 di depan jadi 62 standar internasional)
        let formattedPhone = selectedReg.phone.replace(/[^0-9]/g, '');
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '62' + formattedPhone.slice(1);
        }

        // Susun template kalimat rapi pesannya
        const messageTemplate = `Halo Kak *${selectedReg.fullName}*,\n\n` +
          `Pendaftaran layanan Sicakra WiFi Kakak telah *DISETUJUI*! 🎉\n\n` +
          `Berikut adalah detail akun resmi Kakak untuk masuk ke aplikasi:\n` +
          `• *Username (ID Token)*: *${voucherToken}*\n` +
          `• *Password Sementara*: _Nomor WhatsApp Kakak (${userPassword})_\n\n` +
          `*⚠️ WAJIB:* Demi keamanan data, setelah berhasil login pertama kali, Kakak *diwajibkan langsung mengganti password* bawaan ini pada halaman profil.\n\n` +
          `Silakan login melalui link web resmi kami di sini.\n\n` +
          `Terima kasih telah mempercayai Sicakra WiFi! 🙏`;

        // Amankan string teks agar valid masuk ke URL browser
        const encodedMessage = encodeURIComponent(messageTemplate);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

        // Mencelat ke tab baru WhatsApp otomatis!
        window.open(whatsappUrl, '_blank');
      }

      // Reset semua state ke posisi awal setelah sukses eksekusi
      setSelectedReg(null);
      setIsRejecting(false);
      setRejectReason("");
      
      // Muat ulang data tabel (bisa lewat fungsi bawaan page atau router refresh)
      if (loadDataFromPage) {
        loadDataFromPage();
      } else {
        window.location.reload();
      }
                 
    } catch (err) {
      console.error("Gagal memproses pendaftaran di hook:", err);
      alert("Terjadi kesalahan jaringan saat memproses data.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    data,
    setData,
    selectedReg,
    setSelectedReg,
    isProcessing,
    isRejecting,
    setIsRejecting,
    rejectReason,
    setRejectReason,
    handleProcess,
  };
}