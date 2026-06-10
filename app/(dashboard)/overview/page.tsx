import { cookies } from "next/headers";
import { OverviewView } from "@/components/dashboard/fitur/overview-view";
import { AdminRole } from "@/types";

export default async function OverviewPage() {
  const cookieStore = await cookies();
  const role = (cookieStore.get("sicakra_role")?.value || "OPERASIONAL") as AdminRole;

  return <OverviewView role={role} />;
}