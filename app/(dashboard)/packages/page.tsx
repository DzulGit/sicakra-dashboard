import React from "react";
import { cookies } from "next/headers";
import { PackagesView } from "@/components/dashboard/fitur/packages-view";
import { AdminRole } from "@/types";

export default async function PackagesPage() {
  const cookieStore = await cookies();
  const role = (cookieStore.get("sicakra_role")?.value || "OPERASIONAL") as AdminRole;

  return <PackagesView role={role} />;
}