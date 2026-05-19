# Focused Implementation Specs

These child specs break `../IMPLEMENTATION_SPEC.md` into executable workstreams. The master spec owns sequencing and whole-system architecture; these files own detailed implementation requirements, acceptance criteria, and verification for each domain.

## Spec Index

1. [`01-core-platform.md`](01-core-platform.md) — auth, workspace, Prisma schema, audit, navigation shell.
2. [`02-connectors.md`](02-connectors.md) — connector framework plus Metabase, PostHog, Sentry, Stripe, support connectors.
3. [`03-ai-operator.md`](03-ai-operator.md) — AI chat, tool registry, citations, redaction, permissions.
4. [`04-customizable-ui.md`](04-customizable-ui.md) — declarative dashboard manifests, sandbox generation, preview, rollback.
5. [`05-plugin-ecosystem.md`](05-plugin-ecosystem.md) — plugin SDK, plugin manifests, local loading, security model.
6. [`06-safe-actions.md`](06-safe-actions.md) — dry-run, confirmations, approvals, idempotency, audited actions.
7. [`07-avalon-dogfood.md`](07-avalon-dogfood.md) — private Avalon integration layer and dogfood dashboards.
8. [`08-oss-launch.md`](08-oss-launch.md) — demo data, docs, security posture, public launch readiness.

## Execution Rule

Implement in numeric order unless a later spec is explicitly being prototyped behind demo data. Do not build sensitive write/admin flows before the policy, audit, and redaction layers exist.
