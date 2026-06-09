"use client"

import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginAdmin, fetchSystemStatus } from "@/lib/api"
import { saveAuth } from "@/lib/auth"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { LogoMarquee } from "@/components/login/logo-marquee"
import { Marquee } from "@/components/login/marquee" // 🔥 Kita import Marquee buat teks bawah juga!
import { cn } from "@/lib/utils"

const DotMatrix = dynamic(
  () => import("@/components/login/dot-matrix").then((m) => m.DotMatrix),
  { ssr: false }
)

function AdminLoginForm() {
  const router = useRouter()

  const [role, setRole] = useState('Teknis')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await loginAdmin(email, password, role);
      const extractedRole = res?.role || res?.admin?.role || res?.user?.role || res?.teknis?.role || res?.data?.role;

      if (extractedRole) {
        const profileData = res?.admin || res?.user || res?.teknis || res?.data || res;
        if (typeof saveAuth === 'function') {
          saveAuth(profileData);
        }
        router.push(`/dashboard/${extractedRole.toLowerCase()}`);
      } else {
        setError("Format data akun tidak dikenali oleh sistem.");
      }
    } catch (err: any) {
      setError(err?.message || "Gagal masuk ke dashboard, periksa kembali akun Anda.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-[400px] rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-8 shadow-2xl text-left animate-in fade-in duration-500"
    >
      <div className="mb-6">
        <div className="text-2xl font-semibold text-foreground">Autentikasi</div>
        <p className="text-sm text-muted-foreground mt-1">Masuk untuk melanjutkan ke sistem</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Role Akses</label>
          <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/10 p-1 rounded-lg">
            {['Teknis', 'Keuangan', 'Operasional'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "py-1.5 px-2 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                  role === r
                    ? "bg-white text-black font-semibold shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full h-10 rounded px-3 bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/50 text-sm"
            placeholder="admin@sicakra.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Password</label>
          <div className="relative flex items-center">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="w-full h-10 rounded pl-3 pr-10 bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/50 text-sm"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
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
        if (data && data.length > 0) {
          setMarqueeTexts(data)
        } else {
          throw new Error()
        }
      } catch (err) {
        // 🔥 DUMMY MATERI PENJELASAN SISTEM (NO USER STATS)
        setMarqueeTexts([
          "SICAKRA WORKSPACE: Sistem Informasi & Pusat Kendali Operasional Terpadu PT Sinergi Cakra Buana",
          "MODUL TEKNIS: Manajemen Aktivasi Jaringan, Penugasan Lapangan Teknisi, dan Pemantauan Infrastruktur OLT",
          "MODUL OPERASIONAL: Pengelolaan Paket Layanan Internet, Validasi Pendaftaran Pelanggan, dan Manajemen Inventaris",
          "MODUL KEUANGAN: Rekapitulasi Billing Otomatis, Manajemen Invoice Bulanan, dan Verifikasi Transaksi Tagihan"
        ])
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
        <div className="space-y-5 text-left hidden md:block">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-balance leading-[0.95]">
              Sicakra
              <br />
              <span className="text-muted-foreground">Workspace</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
              Pusat kendali operasional terpadu. Kelola infrastruktur jaringan, pendaftaran pelanggan, dan administrasi keuangan dalam satu platform.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              Real-time System Monitoring
            </div>
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground/80">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              Role-based Access Control
            </div>
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground/80">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
              End-to-End Encryption
            </div>
          </div>

          {/* LOGO SICAKRA MARQUEE */}
          <div className="pt-2 w-[85%]">
             <LogoMarquee />
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="flex justify-center lg:justify-end items-center w-full">
          <AdminLoginForm />
        </div>
      </div>

      {/* 🔥 MARQUEE TEKS BAWAH (Menggunakan Komponen Marquee Biar Looping Seamless) 🔥 */}
      <div className="absolute bottom-0 w-full border-t border-white/5 bg-background/20 backdrop-blur-sm py-1.5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {marqueeTexts.length > 0 && (
          <Marquee pauseOnHover className="[--duration:35s] [--gap:4rem]" repeat={3}>
            {marqueeTexts.map((text: string, idx: number) => (
              <div key={idx} className="flex items-center whitespace-nowrap">
                <span className="text-xs font-medium text-muted-foreground/60 tracking-wide">
                  {text}
                </span>
              </div>
            ))}
          </Marquee>
        )}
      </div>

    </main>
  )
}