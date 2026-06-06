"use client"

//  PERBAIKAN: Pastikan import dari "next/dynamic", bukan "next"
import dynamic from "next/dynamic"
import { useState } from "react"
import { LogoMarquee } from "@/components/login/logo-marquee"
import { V0Logo } from "@/components/login/v0-logo"
import { Button } from "@/components/ui/button"

// Sekarang inisialisasi dynamic ini dijamin aman dan tipenya valid
const DotMatrix = dynamic(
  () => import("@/components/login/dot-matrix").then((m) => m.DotMatrix),
  { ssr: false }
)

// 2. Komponen Form Login Skeleton / UI Utama
function AdminLoginForm() {
  const [role, setRole] = useState('Teknis')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)
    // Replace with real auth flow
    setTimeout(() => setLoading(false), 800)
    console.log('Admin login', { role, username })
  }

  return (
    <form onSubmit={submit} className="w-[380px] rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-8 shadow-2xl text-left">
      <div className="mb-4">
        <div className="text-2xl font-semibold text-foreground">Admin Login</div>
        <p className="text-sm text-muted-foreground">Access the dashboard</p>
      </div>

      <label className="text-xs text-muted-foreground">Role</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full h-10 rounded px-3 bg-input text-foreground border border-border mb-3">
        <option>Teknis</option>
        <option>Keuangan</option>
        <option>Operasional</option>
      </select>

      <label className="text-xs text-muted-foreground">Username</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="w-full h-10 rounded px-3 bg-input text-foreground border border-border mb-3" placeholder="admin@example.com" required />

      <label className="text-xs text-muted-foreground">Password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full h-10 rounded px-3 bg-input text-foreground border border-border mb-4" placeholder="••••••••" required />

      <button type="submit" className="w-full h-11 rounded bg-white text-black font-semibold">{loading ? 'Logging in…' : 'Login Dashboard'}</button>
    </form>
  )
}

// 3. Komponen Utama Halaman Login
export default function Page() {
  return (
    <>
      <a
        href="https://v0.app/templates/clerk-yc-waitlist-wizard-KFyeD1PKXF4?ref=VVPMDT"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-background/90 transition-colors"
      >
        <V0Logo className="h-3 w-auto" />
        <span className="text-xs font-medium text-foreground">Template</span>
      </a>

      <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12 px-4">
        {/* Background Three.js — rendering tanpa memblokir UI */}
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
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                Backed by 
                <svg 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="2" fill="#FF6600"/>
                  <path 
                    d="M7.5 7.5L12 13.5L16.5 7.5H19L13.5 15V19.5H10.5V15L5 7.5H7.5Z" 
                    fill="white"
                  />
                </svg>
                <span className="text-orange-500">Combinator</span>
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-balance leading-[0.95]">
              Code that writes itself,
              <br />
              deploys in seconds.
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto text-balance leading-relaxed">
              An AI-native IDE that turns ideas into production apps. Ship features while your competitors are still in
              standup.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <div className="relative w-[400px] flex items-center justify-center">
              <AdminLoginForm />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Trusted by teams at leading companies</p>
            <div className="animate-marquee-custom flex gap-6 items-center">
              <LogoMarquee />
              <LogoMarquee />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}