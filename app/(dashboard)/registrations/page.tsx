import React from "react";
import { RegistrationsView } from "@/components/dashboard/fitur/registrations/registrations-view";

export const metadata = {
  title: "Validasi Pendaftaran | Sicakra Workspace",
  description: "Panel operasional manajemen validasi pendaftaran internet baru.",
};

export default function RegistrationsPage() {
  return (
    <div className="w-full h-full p-1">
      <RegistrationsView />
    </div>
  );
}