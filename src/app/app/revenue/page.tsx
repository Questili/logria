import { AppShell } from "@/components/AppShell";
import { revenueMovements } from "@/lib/demo-data";
export default function RevenuePage() { return <AppShell title="Revenue Ops"><div className="grid">{revenueMovements.map((m) => <a className="card" href={m.url} key={m.id} style={{ padding: 20 }}><h2>{m.label}</h2><p style={{ color: m.amount >= 0 ? "var(--green)" : "var(--red)", fontSize: 28, fontWeight: 900 }}>{m.amount >= 0 ? "+" : ""}${m.amount}</p><p className="muted">{m.accounts.join(", ")}</p></a>)}</div></AppShell>; }
