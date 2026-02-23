import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DoctorDashboard } from "@/components/doctor-dashboard";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-background">
      <DashboardHeader userName={session!.user.name} />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <DoctorDashboard />
      </main>
    </div>
  );
}
