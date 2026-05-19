import { AppShell } from "@/components/AppShell";
import { supportConversations } from "@/lib/demo-data";
export default function SupportPage() { return <AppShell title="Support Ops"><div className="grid">{supportConversations.map((c) => <a className="card" href={c.url} key={c.id} style={{ padding: 20 }}><h2>{c.subject}</h2><p className="muted">{c.account} · {c.status}</p></a>)}</div></AppShell>; }
