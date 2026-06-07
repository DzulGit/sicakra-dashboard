"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs" // 👈 1. IMPORT CLERK DI SINI
import { CheckCircle, XCircle, Loader2, MapPin, User, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { fetchRegistrations, processRegistration, Registration } from "@/lib/registrations"

export default function RegistrationsPage() {
  const { getToken } = useAuth() // 👈 2. PANGGIL FUNGSI AMBIL TOKEN
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const token = await getToken() 
      
      // 🚨 KITA CEK DI SINI: Apakah tokennya ada?
      console.log("🔑 Kunci Token Clerk:", token) 

      if (!token) {
        console.error("Token kosong! Kayaknya lu belum login sempurna atau sesi expired.")
        return; // Stop di sini kalau tokennya gak ada
      }

      const data = await fetchRegistrations(token) 
      setRegistrations(data)
    } catch (err) {
      console.error("Gagal load registrations", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenProcess = (reg: Registration, type: "APPROVED" | "REJECTED") => {
    setSelectedReg(reg)
    setActionType(type)
  }

  const handleConfirmProcess = async () => {
    if (!selectedReg || !actionType) return
    setIsProcessing(true)

    try {
      const token = await getToken() // 👈 5. DAPATKAN TOKEN UNTUK PROSES UPDATE
      await processRegistration(token || "", selectedReg.id, {
        status: actionType,
      })
      setSelectedReg(null)
      loadData() 
    } catch (err) {
      alert("Terjadi kesalahan saat memproses data.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper Format Tanggal
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Pendaftaran Pelanggan</h2>
          <p className="text-muted-foreground">Tinjau dan proses pendaftaran pelanggan baru Sicakra WiFi.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Kontak & Alamat</TableHead>
                <TableHead>Paket Dipilih</TableHead>
                <TableHead>Waktu Daftar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    Belum ada antrean pendaftaran.
                  </TableCell>
                </TableRow>
              ) : (
                registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    {/* Kolom Pelanggan */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-secondary rounded-full">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{reg.name}</p>
                          <p className="text-xs text-muted-foreground">NIK: {reg.nik}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Kolom Kontak & Alamat */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs gap-1.5">
                          <Phone className="h-3 w-3 text-muted-foreground" /> {reg.phone}
                        </div>
                        <div className="flex items-start text-xs gap-1.5 max-w-[200px] truncate" title={reg.address}>
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" /> {reg.address}
                        </div>
                      </div>
                    </TableCell>

                    {/* Kolom Paket */}
                    <TableCell>
                      <span className="font-medium text-sm">
                        {reg.package?.name || "Paket tidak ditemukan"}
                      </span>
                    </TableCell>

                    {/* Kolom Waktu */}
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(reg.createdAt)}
                    </TableCell>

                    {/* Kolom Status */}
                    <TableCell>
                      <Badge 
                        variant={
                          reg.status === "APPROVED" ? "default" : 
                          reg.status === "REJECTED" ? "destructive" : 
                          "secondary"
                        }
                      >
                        {reg.status}
                      </Badge>
                    </TableCell>

                    {/* Kolom Aksi (Hanya muncul jika status PENDING) */}
                    <TableCell className="text-right">
                      {reg.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10" onClick={() => handleOpenProcess(reg, "APPROVED")}>
                            <CheckCircle className="h-4 w-4 mr-1.5" /> Terima
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => handleOpenProcess(reg, "REJECTED")}>
                            <XCircle className="h-4 w-4 mr-1.5" /> Tolak
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Sudah Diproses</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Konfirmasi */}
      <Dialog open={!!selectedReg} onOpenChange={(open) => !open && setSelectedReg(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pendaftaran</DialogTitle>
            <DialogDescription>
              Anda akan <strong>{actionType === "APPROVED" ? "MENERIMA" : "MENOLAK"}</strong> pendaftaran atas nama <span className="text-foreground font-semibold">{selectedReg?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setSelectedReg(null)} disabled={isProcessing}>
              Batal
            </Button>
            <Button 
              variant={actionType === "APPROVED" ? "default" : "destructive"} 
              onClick={handleConfirmProcess} 
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionType === "APPROVED" ? "Ya, Terima Pendaftaran" : "Ya, Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}