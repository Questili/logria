import { AppShell } from "@/components/AppShell";
import { defaultDashboard } from "@/lib/dashboards/validator";
import { DashboardCustomizer } from "../../DashboardCustomizer";
export default async function DashboardEditPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AppShell title={`Edit dashboard: ${id}`}><DashboardCustomizer initialManifest={defaultDashboard} /></AppShell>; }
