"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogoMarquee } from "@/components/login/logo-marquee"
import { V0Logo } from "@/components/login/v0-logo"
import { loginAdmin } from "@/lib/api"
import { saveAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

const DotMatrix = dynamic(
  () => import("@/components/login/dot-matrix").then((m) => m.DotMatrix),
  { ssr: false }
)

const ROLE_LABELS: Record<string, string> = {
  OPERASIONAL: 'Operasional',
  KEUANGAN: 'Keuangan',
  TEKNIS: 'Teknis',
}

function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { accessToken, admin } = await loginAdmin(email, password)
      saveAuth(accessToken, admin)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-[380px] rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-8 shadow-2xl text-left"
    >
      <div className="mb-6">
        <div className="text-2xl font-semibold text-foreground">Admin Login</div>
        <p className="text-sm text-muted-foreground">Sicakra Dashboard</p>
      </div>

      <div className="space-y-4">
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
          <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded bg-white text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Masuk...' : 'Login Dashboard'}
        </button>
      </div>
    </form>
  )
}

export default function Page() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12 px-4">
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

        <div className="max-w-6xl w-full text-center space-y-10 animate-in fade-in duration-700">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-balance leading-[0.95]">
              Sicakra
              <br />
              <span className="text-muted-foreground">Admin Dashboard</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              Kelola pendaftaran, paket, dan pelanggan Sicakra WiFi.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <AdminLoginForm />
          </div>
        </div>
      </main>
    </>
  )
}