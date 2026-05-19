import Link from "next/link";

const pillars = ["Revenue intelligence", "Product analytics", "Support context", "Incident/AIOps visibility", "Compliance audit trail", "Safe admin workflows", "Plugins and connectors"];

export default function LandingPage() {
  return <main>
    <section className="container" style={{ padding: "32px 0 90px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 80 }}>
        <strong style={{ fontSize: 24 }}>Logria</strong>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Link className="btn" href="/app">Open demo</Link><a className="btn primary" href="https://github.com/questili/logria">GitHub</a></div>
      </nav>
      <div style={{ maxWidth: 930 }}>
        <span className="badge">Open-source · self-hostable · evidence-linked</span>
        <h1 style={{ fontSize: "clamp(44px,8vw,86px)", lineHeight: .96, letterSpacing: "-0.06em", margin: "24px 0" }}>Logria is the open-source AI operations cockpit for modern SaaS teams.</h1>
        <p style={{ fontSize: 24, color: "var(--muted)", maxWidth: 760 }}>Ask Merlin what changed, see the evidence, and act safely across revenue, product, support, incidents, compliance, and admin workflows.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}><Link className="btn primary" href="/app/ask">Ask Merlin</Link><Link className="btn" href="/docs/architecture">Read docs</Link><a className="btn" href="https://app.logria.dev">Hosted app placeholder</a></div>
      </div>
    </section>

    <section className="container grid cols-3" style={{ paddingBottom: 36 }}>{pillars.map((pillar) => <article className="card" key={pillar} style={{ padding: 22 }}><h2>{pillar}</h2><p className="muted">Connect source tools into one operator view with permissions, redaction, evidence links, and audit history.</p></article>)}</section>

    <section className="container card" style={{ padding: 32, marginBottom: 36 }}>
      <span className="badge">Architecture</span><h2 style={{ fontSize: 42 }}>Connectors, not replacements.</h2>
      <p className="muted" style={{ fontSize: 19 }}>Logria integrates with Metabase, PostHog, Sentry, Stripe, and support desks such as Chatwoot/Crisp. The first OSS build ships demo connectors and typed real-connector skeletons so contributors can wire production credentials server-side without leaking secrets to the browser.</p>
    </section>

    <section className="container grid cols-2" style={{ paddingBottom: 72 }}>
      <article className="card" style={{ padding: 28 }}><span className="badge">Safety</span><h2>Evidence before action.</h2><p className="muted">Merlin uses permission-checked tools, redacts sensitive source text, cites evidence, refuses secret extraction, and routes writes through dry-run, confirmation, approvals, idempotency, and audit logs.</p></article>
      <article className="card" style={{ padding: 28 }}><span className="badge">Developers</span><h2>Extend with Guilds.</h2><p className="muted">The plugin SDK supports connectors, tools, widgets, actions, redaction policies, and exports through explicit manifests, narrow capabilities, and review UI before enablement.</p></article>
    </section>
  </main>;
}
