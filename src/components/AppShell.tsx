import Link from "next/link";

const nav = [
  ["Command", "/app"], ["Ask Merlin", "/app/ask"], ["Accounts", "/app/accounts"], ["Revenue", "/app/revenue"],
  ["Product", "/app/product"], ["Incidents", "/app/incidents"], ["Support", "/app/support"], ["Operations", "/app/operations"],
  ["Compliance", "/app/compliance"], ["Dashboards", "/app/dashboards"], ["Plugins", "/app/plugins"], ["Connectors", "/app/settings/connectors"], ["Audit", "/app/audit"],
];

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "260px 1fr" }}>
    <aside style={{ borderRight: "1px solid var(--line)", background: "rgba(8,11,18,.76)", padding: 20, position: "sticky", top: 0, height: "100vh", overflow: "auto" }}>
      <Link href="/" style={{ fontSize: 24, fontWeight: 900 }}>Logria</Link>
      <p className="muted" style={{ marginTop: 4 }}>Merlin-powered ops cockpit</p>
      <nav style={{ display: "grid", gap: 8, marginTop: 24 }}>
        {nav.map(([label, href]) => <Link key={href} className="btn" href={href} style={{ justifyContent: "flex-start" }}>{label}</Link>)}
      </nav>
    </aside>
    <main style={{ padding: "28px clamp(18px,4vw,48px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 24 }}>
        <div><span className="badge">Demo workspace</span><h1 style={{ margin: "10px 0 0", fontSize: 38 }}>{title}</h1></div>
        <Link className="btn" href="/implementation-notes.html">Implementation notes</Link>
      </div>
      {children}
    </main>
  </div>;
}
