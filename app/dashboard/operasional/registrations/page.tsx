"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Loader2, MapPin, User, Phone, Search, Building, FileText, Map, Briefcase, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Registration } from "@/lib/registrations"
import { fetchRegistrations, processRegistration } from "@/lib/registrations"
import { useAuth } from "@clerk/nextjs" // 👈 IMPORT PASUKAN CLERK

export default function RegistrationsPage() {
  const { getToken } = useAuth() // 👈 AMBIL FUNGSI UNTUK GENERATE TOKEN REAL
  const [loading, setLoading] = useState(true)
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // Fungsi handleProcess yang baru (Otomatis deteksi nomor WA + isi pesan)
  const handleProcess = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedReg) return

    // Validasi internal frontend jika menolak tapi alasan kosong
    if (status === "REJECTED" && !rejectReason.trim()) {
      alert("Alasan penolakan wajib diisi!")
      return
    }

    setIsProcessing(true)

    try {
      // 1. Ambil token asimetris dari Clerk dulu (WAJIB DI ATAS)
      const token = await getToken({ template: 'nestjs' })

      // 2. Kirim variabel token yang udah dibuat ke fungsi API (DI BAWAHNYA)
      const response = await processRegistration(token || "", selectedReg.id, {
        status: status,
        rejectReason: status === "REJECTED" ? rejectReason : undefined
      })

      // 3. JIKA STATUSNYA APPROVED, JALANKAN LOGIKA WHATSAPP
      if (status === "APPROVED" && response) {
        const voucherToken = (response as any).accessToken || (response as any).data?.accessToken || "TOKEN-ERROR";
        const userPassword = selectedReg.phone;

        let formattedPhone = selectedReg.phone.replace(/[^0-9]/g, '');
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '62' + formattedPhone.slice(1);
        }

        const messageTemplate = `Halo Kak *${selectedReg.fullName}*,\n\n` +
          `Pendaftaran layanan Sicakra WiFi Kakak telah *DISETUJUI*! 🎉\n\n` +
          `Berikut adalah detail akun resmi Kakak untuk masuk ke aplikasi:\n` +
          `• *Username (ID Token)*: *${voucherToken}*\n` +
          `• *Password Sementara*: _Nomor WhatsApp Kakak (${userPassword})_\n\n` +
          `*⚠️ WAJIB:* Demi keamanan data, setelah berhasil login pertama kali, Kakak *diwajibkan langsung mengganti password* bawaan ini pada halaman profil.\n\n` +
          `Silakan login melalui link web resmi kami di sini.\n\n` +
          `Terima kasih telah mempercayai Sicakra WiFi! 🙏`;

        const encodedMessage = encodeURIComponent(messageTemplate);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
      }

      // Reset state setelah sukses
      setSelectedReg(null)
      setIsRejecting(false)
      setRejectReason("")
      loadData()
    } catch (err) {
      // Reset state setelah gagal dan muat ulang tabel data
      setSelectedReg(null)
      setIsRejecting(false)
      setRejectReason("")
      loadData()
      console.error("Gagal memproses pendaftaran:", err)
      alert("Terjadi kesalahan jaringan saat memproses data.")
    } finally {
      setIsProcessing(false)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // 1. Ambil token asimetris dari Clerk dengan template nestjs
      const token = await getToken({ template: 'nestjs' })

      // 2. Jalankan fetch data dengan token asli
      const data = await fetchRegistrations(token || "")
      setRegistrations(data)
    } catch (err) {
      console.error("Gagal load registrations", err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString))
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Pendaftaran Pelanggan</h2>
          <p className="text-muted-foreground">Tinjau dan verifikasi data lengkap calon pelanggan Sicakra WiFi.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Area Pemasangan</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-secondary rounded-full">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{reg.fullName}</p>
                          <p className="text-xs text-muted-foreground">{reg.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{reg.city}</div>
                      <div className="text-xs text-muted-foreground">Kec. {reg.district}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">
                        {reg.package?.name || "Paket ID: " + reg.packageId.substring(0, 8)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(reg.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={reg.status === "APPROVED" ? "default" : reg.status === "REJECTED" ? "destructive" : "secondary"}>
                        {reg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedReg(reg)}>
                        <Search className="h-4 w-4 mr-2" /> Review Data
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PANEL KANAN RAKSASA (SHEET) */}
      <Sheet open={!!selectedReg} onOpenChange={(open) => !open && setSelectedReg(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0 overflow-hidden bg-background">

          <div className="p-6 border-b">
            <SheetHeader>
              <SheetTitle className="text-2xl">Detail Lengkap Pendaftaran</SheetTitle>
              <SheetDescription>
                ID Pendaftaran: <span className="font-mono text-xs">{selectedReg?.id}</span>
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Area konten yang bisa di-scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {selectedReg && (
              <>
                {/* Bagian 1: Data Diri */}
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> 1. Identitas Pelanggan
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Nama Lengkap</p>
                      <p className="font-medium">{selectedReg.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> No. KTP (NIK)</p>
                      <p className="font-medium">{selectedReg.ktpNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">No. WhatsApp / HP</p>
                      <p className="font-medium">{selectedReg.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Alamat Email</p>
                      <p className="font-medium">{selectedReg.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Pekerjaan</p>
                      <p className="font-medium">{selectedReg.job}</p>
                    </div>
                  </div>
                </section>

                {/* Bagian 2: Alamat & Bangunan */}
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> 2. Detail Lokasi & Bangunan
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Alamat Lengkap</p>
                      <p className="font-medium leading-relaxed">{selectedReg.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">RT / RW</p>
                      <p className="font-medium">{selectedReg.rtRw}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kode Pos</p>
                      <p className="font-medium">{selectedReg.postalCode || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kelurahan / Desa</p>
                      <p className="font-medium">{selectedReg.village}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kecamatan</p>
                      <p className="font-medium">{selectedReg.district}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kota / Kabupaten</p>
                      <p className="font-medium">{selectedReg.city}</p>
                    </div>
                  </div>

                  {/* Info Bangunan */}
                  <div className="bg-muted/30 p-4 rounded-lg border grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Building className="w-3 h-3" /> Tipe Bangunan</p>
                      <p className="font-semibold">{selectedReg.buildingType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><User className="w-3 h-3" /> Status Kepemilikan</p>
                      <p className="font-semibold">{selectedReg.ownershipStatus}</p>
                    </div>
                    <div className="col-span-2 border-t pt-3 mt-1">
                      <p className="text-xs text-muted-foreground mb-2">Koordinat Maps</p>
                      {selectedReg.mapsUrl ? (
                        <a href={selectedReg.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-medium bg-blue-500/10 px-3 py-1.5 rounded-md transition-colors">
                          <Map className="w-4 h-4" /> Buka di Google Maps
                        </a>
                      ) : (
                        <p className="text-sm italic text-muted-foreground">Link Google Maps tidak disertakan.</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Bagian 3: Dokumen Lampiran */}
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-2 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 3. Dokumen Lampiran
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Foto KTP</p>
                      {selectedReg.ktpPhotoUrl ? (
                        <a href={selectedReg.ktpPhotoUrl} target="_blank" rel="noreferrer" className="block border rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                          <img src={selectedReg.ktpPhotoUrl} alt="KTP" className="w-full h-32 object-cover" />
                        </a>
                      ) : <div className="h-32 bg-muted flex items-center justify-center rounded-lg text-xs text-muted-foreground border border-dashed">Belum ada KTP</div>}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Foto Rumah Tampak Depan</p>
                      {selectedReg.housePhotoUrl ? (
                        <a href={selectedReg.housePhotoUrl} target="_blank" rel="noreferrer" className="block border rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                          <img src={selectedReg.housePhotoUrl} alt="Rumah" className="w-full h-32 object-cover" />
                        </a>
                      ) : <div className="h-32 bg-muted flex items-center justify-center rounded-lg text-xs text-muted-foreground border border-dashed">Belum ada Foto Rumah</div>}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Footer Panel: Tombol Aksi nempel di bawah */}
          <div className="p-6 border-t bg-muted/20">
            {selectedReg?.status === "PENDING" ? (
              <div className="flex flex-col gap-4 w-full">

                {/* JIKA SEDANG MODE MENOLAK: Tampilkan Form Alasan */}
                {isRejecting ? (
                  <div className="space-y-2 w-full">
                    <label className="text-xs font-bold text-destructive uppercase tracking-wider">
                      Alasan Penolakan (Wajib Diisi)
                    </label>
                    <textarea
                      className="w-full min-h-[80px] p-2 text-sm bg-background border rounded-md border-destructive/50 focus:outline-none focus:ring-1 focus:ring-destructive"
                      placeholder="Contoh: Wilayah belum tercover jaringan / Tiang ISP penuh..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setIsRejecting(false); setRejectReason(""); }}>
                        Batal
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleProcess("REJECTED")} disabled={isProcessing || !rejectReason.trim()}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                        Konfirmasi Tolak
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* JIKA MODE NORMAL: Tampilkan Tombol Utama */
                  <div className="flex flex-col sm:flex-row gap-3 justify-end w-full">
                    <Button variant="outline" className="sm:mr-auto" onClick={() => setSelectedReg(null)}>
                      Tutup
                    </Button>
                    <Button variant="destructive" onClick={() => setIsRejecting(true)}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Tolak Pendaftaran
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleProcess("APPROVED")} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Terima & Lanjut Teknis
                    </Button>
                  </div>
                )}

              </div>
            ) : (
              /* JIKA STATUS SUDAH APPROVED / REJECTED */
              <div className="w-full text-center p-3 bg-background border rounded-lg space-y-2">
                <p className="text-sm font-medium">
                  Pendaftaran ini sudah diproses:
                  <Badge variant={selectedReg?.status === "APPROVED" ? "default" : "destructive"} className="ml-2">
                    {selectedReg?.status}
                  </Badge>
                </p>
                {selectedReg?.rejectReason && (
                  <div className="text-xs text-left text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 mt-2">
                    <span className="font-bold">Alasan Penolakan:</span> {selectedReg.rejectReason}
                  </div>
                )}
              </div>
            )}
          </div>

        </SheetContent>
      </Sheet>
    </div>
  )
}