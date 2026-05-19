import { AppShell } from "@/components/AppShell";
import { incidents } from "@/lib/demo-data";
export default function IncidentsPage() { return <AppShell title="Incident / AIOps"><div className="grid">{incidents.map((i) => <a className="card" href={i.url} key={i.id} style={{ padding: 20 }}><h2>{i.title}</h2><p>{i.severity} · affects {i.affectedAccounts.join(", ")}</p></a>)}</div></AppShell>; }
