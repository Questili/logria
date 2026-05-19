import type { Evidence } from "@/lib/types";

export function MetricCard({ label, value, note, tone = "var(--cyan)" }: { label: string; value: string; note: string; tone?: string }) {
  return <div className="card" style={{ padding: 20 }}><p className="muted" style={{ margin: 0, fontWeight: 800 }}>{label}</p><strong style={{ display: "block", fontSize: 34, color: tone, margin: "10px 0" }}>{value}</strong><p className="muted" style={{ margin: 0 }}>{note}</p></div>;
}

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  return <div className="grid">{evidence.map((item) => <a key={`${item.sourceType}-${item.objectId}`} className="card" href={item.url} target="_blank" rel="noreferrer" style={{ padding: 14 }}><strong>{item.label}</strong><p className="muted" style={{ margin: "4px 0 0" }}>{item.sourceType} · confidence {Math.round(item.confidence * 100)}%</p></a>)}</div>;
}
