import { InstallationsView } from "@/components/dashboard/installations/installations-view";

export const metadata = {
  title: "Instalasi Tambahan | Sicakra Admin",
  description: "Manajemen aktivasi dan instalasi layanan tambahan pelanggan.",
};

export default function InstallationsPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
      <InstallationsView />
    </main>
  );
}