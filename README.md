# Logria

Logria is the open-source AI operations cockpit for modern SaaS teams. Ask **Merlin** what changed, see the evidence, and act safely across revenue, product analytics, support, incidents, compliance, and admin workflows.

- **OSS/docs domain:** `logria.dev`
- **Hosted app direction:** `app.logria.dev`
- **Assistant:** Merlin
- **Model:** self-hostable OSS first, hosted workspaces later

## What ships in this repo

- Next.js App Router + TypeScript app with a polished public landing page and `/app` cockpit shell.
- Prisma/Postgres schema for workspaces, users, memberships, permissions, connectors, audit events, AI tool calls, dashboard manifests, plugins, approvals, and safe action runs.
- Capability-based permission model; role checks compile to capabilities.
- Demo connectors and typed real-connector skeletons for Metabase, PostHog, Sentry, Stripe, and Chatwoot/Crisp-style support.
- Merlin demo operator with server-side tool calls, redaction, prompt-injection hardening, evidence links, and audit events.
- Declarative dashboard manifests, previewable AI manifest patches, validation, versioning-ready model, and rollback-ready docs.
- Plugin manifest/SDK/local loader plus a sample plugin under `plugins/sample-ops`.
- Safe action framework with dry-run preview, confirmation, idempotency, audit logging, and high-risk approval path.
- Public docs for architecture, security, connectors, plugins, UI manifests, AI safety, and public/private boundaries.

## Quickstart

```bash
pnpm install
cp .env.example .env.local
pnpm prisma:validate
pnpm dev
```

Open `http://localhost:3000` for the landing page or `http://localhost:3000/app` for the demo cockpit. Demo mode does not require external API keys.

For local Postgres:

```bash
docker compose up -d postgres
pnpm prisma generate
```

## Verification

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm secret:scan
pnpm link:check
```

Or run the combined check:

```bash
pnpm verify
```

## Safety boundary

Logria helps collect operational evidence, permissions, approvals, and audit trails. It does **not** make a company compliant by itself. Real connector credentials must stay server-side, and Avalon-specific customer data, identity mappings, dashboards, and playbooks must remain private.

## Docs

- [Architecture](docs/architecture.md)
- [Security](docs/security.md)
- [Threat model](docs/threat-model.md)
- [Connectors](docs/connectors.md)
- [Plugin authoring](docs/plugin-authoring.md)
- [UI manifests](docs/ui-manifests.md)
- [AI safety](docs/ai-safety.md)
- [Public/private boundary](docs/public-private-boundary.md)
- [Domain strategy](DOMAIN_STRATEGY.md)
