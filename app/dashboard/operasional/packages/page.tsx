"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Loader2, Wifi } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { fetchPackages, createPackage, updatePackage, deletePackage, Package } from "@/lib/packages"

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // State untuk form
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    speedDown: "",
    speedUp: "",
    features: "", // Kita pakai string koma (,) dulu biar gampang di form
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  })

  // Load Data dari Backend
  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchPackages()
      setPackages(data)
    } catch (err) {
      console.error("Gagal load packages", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Buka Modal untuk Create
  const handleCreateNew = () => {
    setEditingId(null)
    setFormData({ name: "", price: "", speedDown: "", speedUp: "", features: "", status: "ACTIVE" })
    setIsModalOpen(true)
  }

  // Buka Modal untuk Edit
  const handleEdit = (pkg: Package) => {
    setEditingId(pkg.id)
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      speedDown: pkg.speedDown.toString(),
      speedUp: pkg.speedUp.toString(),
      features: pkg.features.join(", "),
      status: pkg.status,
    })
    setIsModalOpen(true)
  }

  // Hapus Data
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menonaktifkan paket ini?")) return
    try {
      await deletePackage(id)
      loadData()
    } catch (err) {
      alert("Gagal menghapus paket")
    }
  }

  // Submit Form (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Format data biar sesuai ekspektasi backend NestJS
    const payload = {
      name: formData.name,
      price: parseInt(formData.price),
      speedDown: parseInt(formData.speedDown),
      speedUp: parseInt(formData.speedUp),
      features: formData.features.split(",").map(f => f.trim()).filter(f => f !== ""),
      status: formData.status,
    }

    try {
      if (editingId) {
        await updatePackage(editingId, payload)
      } else {
        await createPackage(payload)
      }
      setIsModalOpen(false)
      loadData() // Refresh tabel
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka)
  }

  return (
    <div className="space-y-4">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Daftar Paket Internet</h2>
          <p className="text-muted-foreground">Kelola harga, kecepatan, dan status paket Sicakra WiFi.</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Paket
        </Button>
      </div>

      {/* Tabel Data */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Paket</TableHead>
                <TableHead>Kecepatan</TableHead>
                <TableHead>Harga / Bulan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Belum ada paket yang terdaftar.
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Wifi className="h-4 w-4" />
                        </div>
                        {pkg.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pkg.speedDown} Mbps <span className="text-muted-foreground text-xs">(DL)</span> / {pkg.speedUp} Mbps <span className="text-muted-foreground text-xs">(UL)</span>
                    </TableCell>
                    <TableCell>{formatRupiah(pkg.price)}</TableCell>
                    <TableCell>
                      <Badge variant={pkg.status === "ACTIVE" ? "default" : "secondary"}>
                        {pkg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(pkg)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(pkg.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Dialog Form (Create / Edit) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Paket" : "Tambah Paket Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Paket</label>
              <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Misal: Paket Gamer 50Mbps" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga (Rp)</label>
              <Input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Misal: 250000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Download (Mbps)</label>
                <Input required type="number" value={formData.speedDown} onChange={(e) => setFormData({ ...formData, speedDown: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload (Mbps)</label>
                <Input required type="number" value={formData.speedUp} onChange={(e) => setFormData({ ...formData, speedUp: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fitur (Pisahkan dengan koma)</label>
              <Input required value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Fiber Optic, Gratis Router, Bantuan 24/7" />
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Simpan Perubahan" : "Buat Paket"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}