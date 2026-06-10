import React from "react";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 bg-sidebar border border-sidebar-border rounded-xl space-y-3 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
        <Settings className="w-5 h-5 text-accent animate-spin-slow" />
        <span>Pengaturan Akun Petugas</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Halaman profil, ganti password, dan konfigurasi internal Sicakra WiFi sedang dalam pengembangan.
      </p>
    </div>
  );
}