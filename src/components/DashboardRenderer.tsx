import type { DashboardManifest } from "@/lib/dashboards/schema";

export function DashboardRenderer({ manifest }: { manifest: DashboardManifest }) {
  const widgetMap = new Map(manifest.widgets.map((widget) => [widget.id, widget]));
  return <div className="grid">{manifest.layout.sections.map((section) => <section key={section.id} className="grid cols-4">{section.widgetIds.map((id) => {
    const widget = widgetMap.get(id);
    if (!widget) return null;
    return <article className="card" key={widget.id} style={{ padding: 20 }}><span className="badge">{widget.type}</span><h2>{widget.title}</h2><p className="muted">{widget.description ?? widget.binding.toolId}</p><p>Source: {widget.binding.connectorId}</p></article>;
  })}</section>)}</div>;
}
