"use client"

import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginAdmin, fetchSystemStatus } from "@/lib/api"
import { saveAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

const DotMatrix = dynamic(
  () => import("@/components/login/dot-matrix").then((m) => m.DotMatrix),
  { ssr: false }
)

function AdminLoginForm() {
  const router = useRouter()

  const [role, setRole] = useState('Teknis')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Panggil loginAdmin dengan parameter state 'role' dari dropdown (Aman 👍)
      const res = await loginAdmin(email, password, role);

      console.log("Response Auth:", res); 

      // 2. Ubah nama variabelnya jadi 'extractedRole' agar tidak bentrok dengan state
      const extractedRole = res?.role || res?.admin?.role || res?.user?.role || res?.teknis?.role || res?.data?.role;

      if (extractedRole) {
        // Ambil objek profilnya
        const profileData = res?.admin || res?.user || res?.teknis || res?.data || res;

        // Jalankan fungsi simpan session bawaan lu
        if (typeof saveAuth === 'function') {
          saveAuth(profileData);
        }

        // Direct user sesuai role yang didapat dari backend
        router.push(`/dashboard/${extractedRole.toLowerCase()}`);
      } else {
        setError("Format data akun tidak dikenali oleh sistem.");
      }

    } catch (err: any) {
      setError(err?.message || "Gagal masuk ke dashboard, periksa kembali akun Anda.");
    } finally {
      setLoading(false); // 🔥 Tambahan biar tombolnya gak stuck loading kalau gagal
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-[400px] rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-8 shadow-2xl text-left"
    >
      <div className="mb-6">
        <div className="text-2xl font-semibold text-foreground">Autentikasi</div>
        <p className="text-sm text-muted-foreground mt-1">Masuk untuk melanjutkan ke sistem</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Role Akses</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-10 rounded px-3 bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="Teknis">Teknis</option>
            <option value="Keuangan">Keuangan</option>
            <option value="Operasional">Operasional</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full h-10 rounded px-3 bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/50"
            placeholder="admin@sicakra.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full h-10 rounded px-3 bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/50"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-sm text-destructive animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-4 rounded bg-white text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
        </button>
      </div>
    </form>
  )
}

export default function Page() {
  const [marqueeTexts, setMarqueeTexts] = useState<string[]>([])

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await fetchSystemStatus()
        setMarqueeTexts(data)
      } catch (err) {
        setMarqueeTexts(["⚠️ Sistem pemantauan sedang offline"])
      }
    }
    loadStatus()
  }, [])

  return (
    <main className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center">

      {/* Background Animasi Dot Matrix */}
      <div className="absolute inset-0 -z-20">
        <DotMatrix
          variant="diamond"
          pixelSize={3}
          patternScale={1}
          enableRipples={true}
          rippleIntensityScale={1.5}
          rippleSpeed={0.4}
          speed={1.5}
          edgeFade={0.15}
        />
      </div>

      {/* Kontainer Utama */}
      <div className="w-full max-w-6xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center animate-in fade-in duration-700 z-10 flex-1">

        {/* Kolom Kiri */}
        <div className="space-y-8 text-left hidden md:block">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-balance leading-[0.95]">
              Sicakra
              <br />
              <span className="text-muted-foreground">Workspace</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
              Pusat kendali operasional terpadu. Kelola infrastruktur jaringan, pendaftaran pelanggan, dan administrasi keuangan dalam satu platform.
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              Real-time System Monitoring
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground/80">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              Role-based Access Control
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground/80">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
              End-to-End Encryption
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="flex justify-center lg:justify-end items-center w-full">
          <AdminLoginForm />
        </div>
      </div>

      {/* Marquee Teks Berjalan */}
      <div className="absolute bottom-0 w-full border-t border-white/5 bg-background/20 backdrop-blur-sm py-3">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          {marqueeTexts.length > 0 && (
            <div className="animate-marquee-custom flex min-w-full shrink-0 gap-8 items-center">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-8 items-center whitespace-nowrap">
                  {marqueeTexts.map((text: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-8">
                      <span className="text-xs font-medium text-muted-foreground/70 tracking-wide">
                        {text}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </main>
  )
}