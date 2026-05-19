import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/Cards";
import { demoAccounts, incidents, revenueMovements, supportConversations } from "@/lib/demo-data";

export default function CommandCenter() {
  const netRevenue = revenueMovements.reduce((sum, item) => sum + item.amount, 0);
  return <AppShell title="Command Center"><div className="grid cols-4"><MetricCard label="Net movement" value={`$${netRevenue}`} note="Stripe demo movements" tone="var(--green)" /><MetricCard label="At-risk accounts" value={String(demoAccounts.filter((a) => a.health === "at_risk").length)} note="Revenue + incident context" tone="var(--amber)" /><MetricCard label="Open incidents" value={String(incidents.length)} note="Sentry demo issues" tone="var(--red)" /><MetricCard label="Support queue" value={String(supportConversations.length)} note="Chatwoot/Crisp demo" /></div></AppShell>;
}
