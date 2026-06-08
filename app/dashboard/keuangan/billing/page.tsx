import React from "react";
import { auth } from "@clerk/nextjs/server";
import { FinanceFitur } from "@/components/dashboard/fitur/finance";

// Fungsi pembantu untuk menggenerate tanggal relatif terhadap hari ini
const getPastDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const getFutureDate = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString();
};

export default async function KeuanganBillingPage() {
  // DATA DUMMY TESTING UNTUK VALIDASI WARNA GRADASI LU
  const dummyInvoices = [
    {
      id: "inv-001",
      customerName: "Ahmad Subarjo",
      invoiceNumber: "SCK-2026-001",
      amount: 150000,
      status: "PAID",
      dueDate: getPastDate(2), // Sudah bayar, harusnya warna HIJAU CLEAN
      paymentUrl: "https://checkout.xendit.co/v2/mock-paid",
      user: { wifiId: "WIFI-0988", fullName: "Ahmad Subarjo", phone: "081234567890" }
    },
    {
      id: "inv-002",
      customerName: "Siti Rahmawati",
      invoiceNumber: "SCK-2026-002",
      amount: 250000,
      status: "PENDING",
      dueDate: getFutureDate(5), // Belum lewat jatuh tempo, harusnya warna BIRU
      paymentUrl: "https://checkout.xendit.co/v2/mock-pending",
      user: { wifiId: "WIFI-1122", fullName: "Siti Rahmawati", phone: "08987654321" }
    },
    {
      id: "inv-003",
      customerName: "Budi Setiawan",
      invoiceNumber: "SCK-2026-003",
      amount: 150000,
      status: "PENDING",
      dueDate: getPastDate(3), // Telat 3 hari, harusnya keluar KUNING 🟡
      paymentUrl: "https://checkout.xendit.co/v2/mock-late-1",
      user: { wifiId: "WIFI-4455", fullName: "Budi Setiawan", phone: "085511223344" }
    },
    {
      id: "inv-004",
      customerName: "Deddy Corbuzier",
      invoiceNumber: "SCK-2026-004",
      amount: 400000,
      status: "PENDING",
      dueDate: getPastDate(7), // Telat 7 hari, harusnya keluar ORANGE & PULSE 🟠
      paymentUrl: "https://checkout.xendit.co/v2/mock-late-2",
      user: { wifiId: "WIFI-7788", fullName: "Deddy Corbuzier", phone: "081122334455" }
    },
    {
      id: "inv-005",
      customerName: "Erik Thohir",
      invoiceNumber: "SCK-2026-005",
      amount: 300000,
      status: "PENDING",
      dueDate: getPastDate(14), // Telat 14 hari, harusnya MERAH MENYALA & TAGIH KERAS 🔴
      paymentUrl: "https://checkout.xendit.co/v2/mock-late-3",
      user: { wifiId: "WIFI-2233", fullName: "Erik Thohir", phone: "081299887766" }
    }
  ];

  return (
    <main className="w-full">
      <FinanceFitur
        initialData={dummyInvoices}
        role="KEUANGAN"
      />
    </main>
  );
}