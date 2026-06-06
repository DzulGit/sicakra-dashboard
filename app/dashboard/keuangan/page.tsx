export default function KeuanganDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Dashboard Keuangan 💰</h1>
        <p className="text-lg text-muted-foreground">
          Selamat datang di pusat manajemen tagihan dan administrasi Sicakra.
        </p>
        <div className="p-4 mt-6 rounded-lg bg-white/5 border border-border inline-block">
          <p className="text-sm font-mono text-emerald-400">Status Akses: BERHASIL</p>
        </div>
      </div>
    </div>
  )
}