import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DashboardRenderer } from "@/components/DashboardRenderer";
import { defaultDashboard } from "@/lib/dashboards/validator";
export default function DashboardsPage() { return <AppShell title="Dashboards"><div style={{ marginBottom: 18 }}><Link className="btn primary" href="/app/dashboards/daily-ops-review/edit">Customize with Merlin</Link></div><DashboardRenderer manifest={defaultDashboard} /></AppShell>; }
