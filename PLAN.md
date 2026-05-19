# Codex Super Prompt: Build Logria End to End

You are Codex operating as an autonomous senior full-stack/product engineer. Your goal is to take the existing Logria planning folder and turn it into a public open-source product repository at `questili/logria`, then implement the product end to end using disciplined branches, commits, GitHub workflows, and PRs.

## Project Context

- Current local planning folder: `/Users/nishchay/code/avalon-godView`
- Existing Avalon app for technical/product grounding: `/Users/nishchay/code/avalon`
- Public product name: **Logria**
- Primary OSS/docs domain: **logria.dev**
- Hosted app domain: **app.logria.dev**
- AI assistant name: **Merlin**
- GitHub repository to create: `questili/logria`
- GitHub CLI is already logged in. Use `gh` for GitHub operations.

Logria is an open-source, AI-native SaaS operations cockpit. It connects revenue, support, product analytics, incidents, compliance, and admin workflows into one evidence-linked command center. It should be self-hostable, plugin-extensible, and eventually offered as a hosted app at `app.logria.dev`.

## Source Documents to Read First

Before implementing, read these files in `/Users/nishchay/code/avalon-godView`:

1. `PRD.md`
2. `IMPLEMENTATION_SPEC.md`
3. `DOMAIN_STRATEGY.md`
4. `specs/README.md`
5. `specs/01-core-platform.md`
6. `specs/02-connectors.md`
7. `specs/03-ai-operator.md`
8. `specs/04-customizable-ui.md`
9. `specs/05-plugin-ecosystem.md`
10. `specs/06-safe-actions.md`
11. `specs/07-avalon-dogfood.md`
12. `specs/08-oss-launch.md`

Use `/Users/nishchay/code/avalon` only as a reference for stack, patterns, and product grounding. Do **not** copy Avalon secrets, private customer-specific logic, private admin actions, or proprietary production data into Logria.

## Operating Rules

- Be autonomous and keep working until the goal is fully completed or blocked by an external credential/permission issue.
- Do not ask questions unless a decision is genuinely blocked and cannot be safely assumed.
- Use small, coherent branches and PRs.
- Commit when a coherent unit is complete and verified.
- Use Conventional Commit messages.
- Use `gh` CLI for repository, issue, workflow, and PR operations.
- Ask before any destructive action or force push.
- Never commit secrets.
- Keep implementation production-grade and maintainable; avoid MVP shortcuts that undermine safety, permissions, auditability, or extensibility.
- Prefer one canonical implementation path over duplicate/temporary logic.
- Verify every meaningful change with the smallest sufficient checks.
- Keep public/private boundaries strict: Logria is public OSS; Avalon dogfood integration must remain private or demo/sanitized.

## High-Level End State

By the end, the repository `questili/logria` should contain:

- A working Next.js/TypeScript app.
- A polished landing page for `logria.dev` positioning.
- App shell for `app.logria.dev`.
- Prisma/Postgres data model for workspaces, users, memberships, connectors, audit events, AI tool calls, dashboard manifests, plugins, approvals, and action runs.
- Auth and capability-based permission model.
- Connector framework with demo connectors and real connector skeletons for Metabase, PostHog, Sentry, Stripe, and support tools.
- Evidence-linked AI operator chat named Merlin.
- Declarative dashboard manifest renderer and AI-customizable UI flow.
- Plugin SDK/manifest/local plugin loader with sample plugin.
- Safe action framework with dry-run, confirmation, approval, idempotency, and audit logs.
- Public docs, quickstart, architecture, security model, threat model, plugin authoring guide, connector guide, and domain strategy.
- GitHub Actions workflows for lint, typecheck, tests, build, security/secret scan where feasible.
- Seed/demo data so a new contributor can run Logria locally without real external secrets.

## Phase 0: Repository Creation and Bootstrap

1. Inspect `/Users/nishchay/code/avalon-godView` and confirm it is not already a Git repo.
2. Initialize a new Git repository if needed.
3. Create `questili/logria` using `gh repo create questili/logria --public` or equivalent.
4. Set the remote to `git@github.com:questili/logria.git` or HTTPS, whichever matches local auth.
5. Create a branch: `bootstrap/project-foundation`.
6. Preserve the existing planning docs in the repo:
   - `PRD.md`
   - `IMPLEMENTATION_SPEC.md`
   - `DOMAIN_STRATEGY.md`
   - `PLAN.md`
   - `specs/**`
7. Add baseline repo files:
   - `README.md`
   - `LICENSE` after choosing the license; default to Apache-2.0 unless there is a strong reason otherwise.
   - `CONTRIBUTING.md`
   - `SECURITY.md`
   - `.gitignore`
   - `.env.example`
8. Commit and open the first PR.

Acceptance:
- Public GitHub repo exists at `questili/logria`.
- Planning docs are committed.
- README explains Logria, `logria.dev`, `app.logria.dev`, Merlin, OSS/self-host, and hosted direction.

## Phase 1: Scaffold the App

Branch: `feat/core-platform`

1. Scaffold a Next.js App Router project with TypeScript.
2. Use pnpm.
3. Add formatting/lint/typecheck/test scripts.
4. Add Prisma and Postgres configuration.
5. Add Docker Compose for local Postgres.
6. Add basic app routes:
   - `/` landing page
   - `/app` command center shell
   - `/app/ask`
   - `/app/accounts`
   - `/app/revenue`
   - `/app/product`
   - `/app/incidents`
   - `/app/support`
   - `/app/operations`
   - `/app/compliance`
   - `/app/plugins`
   - `/app/settings/connectors`
   - `/app/audit`
7. Add baseline UI components and layout.
8. Commit and open/update PR.

Acceptance:
- App boots locally.
- Build/typecheck/lint pass.
- Routes render without runtime errors.

## Phase 2: Landing Page

Branch: `feat/landing-page`

Build a polished public landing page for Logria.

Landing page content must include:

- Hero:
  - “Logria is the open-source AI operations cockpit for modern SaaS teams.”
  - “Ask Merlin what changed, see the evidence, and act safely.”
- Clear OSS + hosted model:
  - Self-host from GitHub.
  - Hosted workspaces at `app.logria.dev`.
- Core value pillars:
  - Revenue intelligence.
  - Product analytics.
  - Support context.
  - Incident/AIOps visibility.
  - Compliance/audit trail.
  - Safe admin workflows.
  - Plugins and connectors.
- Architecture section explaining Metabase/PostHog/Sentry/Stripe/support connectors.
- Safety section: permissions, redaction, audit logs, approvals, evidence citations.
- Developer section: plugin SDK, connector framework, self-hosting.
- CTA links to GitHub, docs, and hosted app placeholder.

Acceptance:
- Landing page is credible, not generic AI fluff.
- Copy is truthful: do not claim unavailable features are already production-ready unless implemented.
- Responsive and accessible.
- Build/lint/typecheck pass.

## Phase 3: Core Platform

Implement `specs/01-core-platform.md`.

Deliver:

- Auth foundation.
- Workspace tenancy.
- Memberships and role-to-capability permission model.
- Prisma schema/migrations.
- Server helpers:
  - `requireUser()`
  - `requireWorkspaceAccess()`
  - `requirePermission()`
  - `emitAuditEvent()`
- Audit event list page.
- Tests for permission mapping and audit logging.

Acceptance:
- Unauthorized users cannot access workspace data.
- Audit events can be written/read by authorized users.
- Role checks compile to capabilities; no scattered string-role checks.

## Phase 4: Connectors

Implement `specs/02-connectors.md`.

Deliver:

- Connector registry.
- Connector installation model.
- Credential storage abstraction.
- Connector health checks.
- Demo connectors for revenue/product/incidents/support.
- Real connector skeletons or functional read-only connectors for:
  - Metabase
  - PostHog
  - Sentry
  - Stripe
  - Crisp or Chatwoot support
- Connector settings UI.
- Source/freshness metadata.

Acceptance:
- Demo mode works without secrets.
- No connector secret reaches client code.
- Connector failures degrade gracefully.

## Phase 5: AI Operator Merlin

Implement `specs/03-ai-operator.md`.

Deliver:

- `/app/ask` Merlin chat UI.
- Server-side AI tool registry.
- Read-only tool calling over demo/real connectors.
- Evidence-linked answers.
- Redaction layer.
- Prompt-injection defenses for external source text.
- Audit logs for AI messages and tool calls.

Acceptance:
- Merlin answers cross-tool questions with citations/source links.
- Merlin refuses unauthorized or uncited-sensitive requests.
- AI tool calls are visible in audit logs.

## Phase 6: AI-Customizable UI

Implement `specs/04-customizable-ui.md`.

Deliver:

- Dashboard manifest schema.
- Widget manifest schema.
- Manifest renderer.
- Dashboard versioning.
- AI-generated manifest patch flow.
- Preview/apply/discard UI.
- Rollback.

Acceptance:
- User can create a personal dashboard via chat.
- AI generates manifest patches, not arbitrary React code.
- Unauthorized sources/widgets are rejected by validation.
- User can rollback to a prior version.

## Phase 7: Plugin Ecosystem

Implement `specs/05-plugin-ecosystem.md`.

Deliver:

- Plugin manifest schema.
- Local plugin loader.
- Plugin SDK types/helpers.
- Plugin review UI.
- Sample plugin contributing:
  - one demo connector
  - one widget
  - one read-only AI tool
- Plugin health/isolation behavior.

Acceptance:
- A plugin can be added without editing core source files.
- Plugin permissions are visible before enablement.
- Broken plugin cannot crash the app.

## Phase 8: Safe Actions

Implement `specs/06-safe-actions.md`.

Deliver:

- Action registry.
- Low-risk action support.
- Dry-run/preview flow.
- Confirmation and reason capture.
- Approval request model for high-risk actions.
- Idempotency and result tracking.
- Audit integration.

Acceptance:
- Low-risk action executes only after confirmation.
- High-risk action creates approval request and does not execute immediately.
- All action runs are audited.
- Merlin can propose actions but cannot execute without confirmation.

## Phase 9: Avalon Dogfood Layer

Implement `specs/07-avalon-dogfood.md` carefully.

Rules:

- Keep this private or demo/sanitized.
- Do not commit Avalon secrets, customer data, private admin scripts, or internal playbooks.
- If dogfood requires private config, document the interface and keep the private files out of the public repo.

Deliver public-safe parts:

- Private integration guide.
- Identity-mapping interface.
- Demo Avalon-like fixtures.
- Support-code lookup pattern using fake data.
- Paid-user incident-impact demo using fake data.

Acceptance:
- Public repo remains safe.
- Avalon can dogfood with private config outside public repo.

## Phase 10: OSS Launch Readiness

Implement `specs/08-oss-launch.md`.

Deliver:

- Complete README.
- Quickstart under 10 minutes.
- Demo seed data.
- Docs:
  - `docs/architecture.md`
  - `docs/security.md`
  - `docs/threat-model.md`
  - `docs/connectors.md`
  - `docs/plugin-authoring.md`
  - `docs/ui-manifests.md`
  - `docs/ai-safety.md`
  - `docs/public-private-boundary.md`
- GitHub issue templates and PR template.
- Screenshots or demo GIF placeholders.
- Launch checklist.

Acceptance:
- Fresh clone can run the demo locally.
- Docs clearly explain the product, setup, security model, and contribution path.
- No public/private boundary leaks.

## GitHub Workflow Requirements

Add GitHub Actions workflows:

- CI: install, lint, typecheck, test, build.
- Prisma/schema validation.
- Secret scanning or equivalent lightweight check.
- Dependency/security audit where feasible.
- Optional docs/link check.

Use branch protection guidance in docs, even if branch rules cannot be set automatically.

## Commit and PR Discipline

Use one branch per phase or coherent subphase.

Suggested PR order:

1. `bootstrap/project-foundation`
2. `feat/core-platform`
3. `feat/landing-page`
4. `feat/connectors`
5. `feat/merlin-ai-operator`
6. `feat/customizable-ui-manifests`
7. `feat/plugin-ecosystem`
8. `feat/safe-actions`
9. `feat/avalon-dogfood-demo`
10. `docs/oss-launch-readiness`

For each PR, include:

```markdown
## Why
- ...

## How
- ...

## Tests
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
```

Do not merge PRs until checks pass. If direct merging is required and permitted, use `gh pr merge` only after verification.

## Verification Standard

Before claiming a phase is complete:

- Run the focused checks for touched code.
- Run lint/typecheck/build for app-level changes.
- Run tests for security/policy/audit/AI/connector behavior.
- Confirm no secrets were committed.
- Confirm docs match implemented behavior.

## Final Completion Criteria

The overall goal is complete only when:

- `questili/logria` exists publicly.
- Logria has a working app and polished landing page.
- Core platform, connectors, Merlin, UI manifests, plugin system, safe actions, and OSS docs are implemented to the level specified above.
- GitHub Actions are in place and passing.
- Public/private boundaries are documented and respected.
- All changes are committed in coherent history and PRs are opened/merged as appropriate.
- A final status report lists what shipped, repo URL, open PRs/issues, verification results, and remaining known risks.
