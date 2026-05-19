import { AppShell } from "@/components/AppShell";
import { demoAccounts } from "@/lib/demo-data";
export default function AccountsPage() { return <AppShell title="Account 360"><div className="grid cols-3">{demoAccounts.map((a) => <article className="card" key={a.id} style={{ padding: 20 }}><h2>{a.name}</h2><p className="muted">{a.domain} · {a.plan}</p><p>MRR ${a.mrr} · activation {a.activation}% · {a.health}</p><p>{a.supportOpen} support conversations · {a.incidents.length} incidents · {a.failedPayments} failed payments</p></article>)}</div></AppShell>; }
