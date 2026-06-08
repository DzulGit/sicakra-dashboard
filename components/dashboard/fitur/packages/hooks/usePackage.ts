import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function usePackage(initialData: any[] = [], onRefresh?: () => void) {
  const { getToken } = useAuth();
  
  // State manajemen terpusat untuk paket
  const [packages, setPackages] = useState<any[]>(initialData);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // State untuk form input (Tambah / Edit)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    speedDown: 10,
    speedUp: 10,
    features: ["", "", ""], // Default 3 baris fitur
  });

  // Fungsi untuk membuka modal (Mode Tambah Baru atau Mode Edit)
  const openFormModal = (pkg: any | null = null) => {
    if (pkg) {
      // Jika ada data pkg, artinya MODE EDIT
      setSelectedPackage(pkg);
      setFormData({
        name: pkg.name,
        description: pkg.description || "",
        price: pkg.price,
        speedDown: pkg.speedDown,
        speedUp: pkg.speedUp,
        features: pkg.features && pkg.features.length > 0 ? pkg.features : ["", "", ""],
      });
    } else {
      // Jika null, artinya MODE TAMBAH BARU
      setSelectedPackage(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        speedDown: 10,
        speedUp: 10,
        features: ["", "", ""],
      });
    }
    setIsModalOpen(true);
  };

  // Fungsi eksekusi simpan ke Backend (Tambah / Update)
  const handleSaveSubmit = async (apiSaveFn: Function) => {
    if (!formData.name || formData.price <= 0) {
      alert("Nama paket dan harga wajib diisi dengan benar!");
      return;
    }

    setIsProcessing(true);
    try {
      const token = await getToken({ template: "nestjs" });
      
      // Filter fitur yang kosong agar tidak ikut tersimpan ke database
      const cleanFeatures = formData.features.filter(f => f.trim() !== "");

      const payload = {
        ...formData,
        price: Number(formData.price),
        speedDown: Number(formData.speedDown),
        speedUp: Number(formData.speedUp),
        features: cleanFeatures,
      };

      // Jalankan fungsi API (Tambah jika tidak ada selectedPackage, Edit jika ada)
      await apiSaveFn(token || "", selectedPackage?.id || null, payload);

      alert(selectedPackage ? "Paket berhasil diperbarui!" : "Paket baru berhasil ditambahkan!");
      setIsModalOpen(false);
      
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Gagal menyimpan paket di hook:", err);
      alert("Terjadi kesalahan sistem saat menyimpan data paket.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fungsi untuk mengubah status ACTIVE / INACTIVE paket
  const handleToggleStatus = async (id: string, currentStatus: string, apiToggleFn: Function) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const konfirmasi = window.confirm(`Apakah Anda yakin ingin mengubah status paket ini menjadi ${nextStatus}?`);
    if (!konfirmasi) return;

    try {
      const token = await getToken({ template: "nestjs" });
      await apiToggleFn(token || "", id, { status: nextStatus });
      
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Gagal mengubah status paket:", err);
      alert("Gagal mengubah status keaktifan paket.");
    }
  };

  return {
    packages,
    setPackages,
    selectedPackage,
    isModalOpen,
    setIsModalOpen,
    isProcessing,
    formData,
    setFormData,
    openFormModal,
    handleSaveSubmit,
    handleToggleStatus,
  };
}