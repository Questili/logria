import { AppShell } from "@/components/AppShell";
import { productSignals } from "@/lib/demo-data";
export default function ProductPage() { return <AppShell title="Product Analytics"><div className="grid cols-3">{productSignals.map((s) => <a className="card" href={s.url} key={s.id} style={{ padding: 20 }}><h2>{s.event}</h2><p style={{ fontSize: 32, fontWeight: 900 }}>{s.count}</p><p className="muted">{s.account}</p></a>)}</div></AppShell>; }
