import { AppShell } from "@/components/AppShell";
import { listAuditEvents } from "@/lib/audit";
export default function AuditPage() { return <AppShell title="Chronicle Audit Trail"><div className="grid">{listAuditEvents().map((event) => <article className="card" key={event.id} style={{ padding: 18 }}><strong>{event.eventType}</strong><p className="muted">{event.riskLevel} · {event.targetType}:{event.targetId} · {new Date(event.createdAt).toLocaleString()}</p><p>{event.reason}</p></article>)}</div></AppShell>; }
