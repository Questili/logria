import { AppShell } from "@/components/AppShell";
import { DashboardRenderer } from "@/components/DashboardRenderer";
import { defaultDashboard } from "@/lib/dashboards/validator";
export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AppShell title={`Dashboard: ${id}`}><DashboardRenderer manifest={defaultDashboard} /></AppShell>; }
