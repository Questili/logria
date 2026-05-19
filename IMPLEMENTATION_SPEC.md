# Implementation Spec: AI-Native SaaS Operations Cockpit

**Related PRD:** `PRD.md`  
**Initial dogfood:** `/Users/nishchay/code/avalon`  
**Repo target:** `/Users/nishchay/code/avalon-godView`  
**Domain strategy:** [`DOMAIN_STRATEGY.md`](DOMAIN_STRATEGY.md)  

---

## Child Specs

The detailed executable workstreams live under [`specs/`](specs/):

1. [`specs/01-core-platform.md`](specs/01-core-platform.md) — auth, workspace, Prisma schema, audit, navigation shell.
2. [`specs/02-connectors.md`](specs/02-connectors.md) — connector framework plus Metabase, PostHog, Sentry, Stripe, support connectors.
3. [`specs/03-ai-operator.md`](specs/03-ai-operator.md) — AI chat, tools, evidence, redaction, permissions.
4. [`specs/04-customizable-ui.md`](specs/04-customizable-ui.md) — dashboard manifests, sandboxed generation, preview, rollback.
5. [`specs/05-plugin-ecosystem.md`](specs/05-plugin-ecosystem.md) — plugin SDK, manifests, local loading, security model.
6. [`specs/06-safe-actions.md`](specs/06-safe-actions.md) — dry-run, confirmations, approvals, idempotency, audited actions.
7. [`specs/07-avalon-dogfood.md`](specs/07-avalon-dogfood.md) — private Avalon integration layer and dogfood dashboards.
8. [`specs/08-oss-launch.md`](specs/08-oss-launch.md) — demo data, docs, security posture, public launch readiness.

Keep this file as the sequencing/architecture overview. Update the child spec when changing detailed implementation requirements for a specific workstream.

---

## 1. Delivery Strategy

Build in layers so the project is useful before it is powerful:

1. **Core shell**: auth, workspace, navigation, audit events, connector registry.
2. **Read-only intelligence**: demo connectors, Metabase/PostHog/Sentry/Stripe/support connectors, Account 360, home dashboard.
3. **AI operator**: tool registry, evidence-linked answers, redaction, permission checks.
4. **AI-customizable UI**: declarative dashboard manifests, sandboxed generation, preview, versioning, rollback.
5. **Plugin ecosystem**: local plugin contract, sample plugins, plugin permission review, registry-ready metadata.
6. **Safe actions**: dry-run, confirmation, approvals, idempotency, audit log, low-risk operational actions.
7. **Avalon dogfood layer**: private account mapping, support-code lookup, paid-user incident impact, sync health, Avalon-specific dashboards.

---

## 2. Architecture Decisions

### 2.1 Core Stack

- Next.js App Router, React, TypeScript.
- Postgres + Prisma.
- Auth compatible with Avalon direction (`better-auth` preferred initially).
- AI SDK-style server tools; keep tool schemas JSON-schema-safe.
- TanStack Table/Virtual for dense data tables.
- Docker Compose for local self-hosting.
- Optional package split once stable:
  - `@ops/core`
  - `@ops/connectors`
  - `@ops/plugin-sdk`
  - `@ops/ui-manifest`

### 2.2 Key Rule

The AI never gets raw root access. It can only call registered, permission-checked, audited tools and can only mutate UI through validated manifests.

---

## 3. Data Model Spec

### Workspace and Auth

- `Workspace`: tenant/org container.
- `User`: authenticated operator.
- `Membership`: role and capability grants.
- `PermissionGrant`: optional explicit capability overrides.

### Connectors

- `ConnectorInstallation`: type, workspace, status, config metadata.
- `ConnectorCredential`: encrypted secret reference, never sent to client.
- `ConnectorHealthCheck`: status, latency, last success/failure, error summary.
- `SourceObjectLink`: stable mapping to external objects.

### AI and Evidence

- `AIOperatorThread`: conversation metadata.
- `AIMessage`: role, content, redaction status.
- `AIToolCall`: tool ID, input hash, output summary, source links, risk level.
- `EvidenceLink`: source type, external URL/object ID, confidence, timestamp.

### UI Customization

- `DashboardManifest`: typed JSON dashboard definition.
- `DashboardVersion`: prompt, diff, author, model/provider, validation result.
- `WidgetManifest`: widget type, query/tool bindings, display config, permissions.
- `LayoutPreference`: personal/team/global view assignment.

### Plugins

- `PluginInstallation`: plugin identity, version, source, status.
- `PluginPermissionGrant`: granted capabilities and scopes.
- `PluginAuditEvent`: install/update/disable/runtime activity.

### Actions and Audit

- `AuditEvent`: actor, action, target, risk, reason, before/after refs.
- `ApprovalRequest`: requested action, approvers, status, expiry.
- `OpsActionRun`: dry-run/result, idempotency key, rollback notes.

---

## 4. Connector Contract

Every connector exports:

- metadata: `id`, `name`, `category`, `version`;
- config schema;
- secret schema;
- health check;
- tool list;
- source-link builder;
- redaction policy;
- demo fixtures;
- tests.

Tool risk levels:

- `read`
- `sensitive_read`
- `low_write`
- `high_write`
- `destructive`

V1 connectors:

1. Metabase: dashboards/cards/questions and result fetch.
2. PostHog: person/event/insight lookup.
3. Sentry: issues/events/affected users/releases.
4. Stripe: customer/subscription/invoice/payment failure lookup.
5. Support: Crisp first for Avalon dogfood or Chatwoot first for OSS demo.

---

## 5. AI Operator Spec

### Required Pipeline

1. Parse user request.
2. Classify intent: dashboard, account lookup, incident, revenue, support, product analytics, action, UI customization, plugin management.
3. Resolve required permissions.
4. Select tools.
5. Run tools server-side with audited inputs.
6. Redact/normalize outputs.
7. Compose answer with evidence links.
8. If action/customization is requested, show preview and require confirmation.

### Refusal Conditions

- No permission for requested data/action.
- Request asks for hidden secrets or raw credentials.
- Request requires destructive action not enabled by policy.
- Tool output has no evidence and the user asks for factual certainty.
- Prompt-injected external content asks the assistant to ignore policy.

---

## 6. AI-Customizable UI Spec

### Manifest Shape

Dashboards are declarative manifests with:

- title, description, owner scope;
- layout grid;
- widget list;
- data bindings to connector tools/saved queries;
- filters and parameters;
- required permissions;
- freshness/caching policy;
- version metadata.

### Generation Flow

1. User asks for a layout/change by chat or voice.
2. AI generates a manifest patch in a sandbox.
3. Validator checks schema, permissions, data bindings, risk, and renderability.
4. System renders preview with fake or live permission-checked data.
5. User applies, saves as draft, or discards.
6. System records version and audit event.

### Guardrails

- No arbitrary React/code generation in v1.
- No new network calls except through installed connectors/plugins.
- No bypass of row/field redaction.
- Personal changes do not affect team/global dashboards.
- Team/global changes require admin approval.

---

## 7. Plugin Ecosystem Spec

### V1 Plugin SDK

A plugin can contribute:

- connector definitions;
- AI tools;
- widgets backed by safe data contracts;
- actions with risk declarations;
- redaction/policy extensions.

### Local Plugin Loading

- Plugins live under `plugins/<plugin-id>` during v1.
- Each plugin has `plugin.json` plus server/client entrypoints where needed.
- Core app validates manifest before enabling.
- Broken plugins are disabled and reported without crashing the host.

### Plugin Review UI

Before install/enable, show:

- publisher and version;
- requested secrets;
- network domains;
- permissions;
- data categories;
- risk levels;
- audit events emitted.

---

## 8. UI IA / Pages

- `/` Command Center
- `/ask` AI Operator
- `/accounts` Account search
- `/accounts/[id]` Account 360
- `/revenue`
- `/product`
- `/incidents`
- `/support`
- `/operations`
- `/compliance`
- `/dashboards`
- `/dashboards/[id]/edit` Manifest editor/AI customizer
- `/plugins`
- `/settings/connectors`
- `/settings/security`
- `/audit`

---

## 9. Build Milestones and Acceptance Criteria

### Milestone 1: Scaffold and Core Model

**Build**

- Next.js app, TypeScript, lint/typecheck scripts.
- Prisma schema for workspace/auth/connectors/audit/manifests/plugins.
- Basic auth and workspace membership.
- Navigation shell.

**Accept**

- App boots locally.
- A user can sign in and view an empty command center.
- Audit table can record a test event.

### Milestone 2: Demo Connectors and Dashboard

**Build**

- Connector registry.
- Demo connectors for revenue, product, incidents, support.
- Home dashboard using source cards.
- Connector health states.

**Accept**

- Dashboard renders from connector contract only.
- Turning off a connector degrades gracefully.
- Source card shows freshness and source link.

### Milestone 3: Real Read-Only Connectors

**Build**

- Metabase connector.
- PostHog connector.
- Sentry connector.
- Stripe connector.
- Crisp or Chatwoot connector.

**Accept**

- Each connector has health check, fixtures, and at least 3 read tools.
- Account 360 can merge at least billing + product + incident/support data.
- No connector secret reaches client-side code.

### Milestone 4: AI Operator

**Build**

- AI chat page.
- Tool registry with permission/risk gates.
- Evidence-linked answers.
- Redaction layer.
- Audit logs for tool calls.

**Accept**

- AI can answer cross-tool read-only questions with citations.
- AI refuses unauthorized/sensitive requests.
- Tool calls are visible in audit logs.

### Milestone 5: Customizable UI

**Build**

- Dashboard manifest schema.
- Manifest renderer.
- Manifest versioning and rollback.
- AI manifest patch generation.
- Preview/apply/discard flow.

**Accept**

- User can create a new personal dashboard by chat.
- Validator blocks invalid or unauthorized widgets.
- User can rollback to prior dashboard version.

### Milestone 6: Plugin Foundation

**Build**

- Plugin manifest schema.
- Local plugin loader.
- Sample plugin with connector + widget + AI tool.
- Plugin install/review UI.

**Accept**

- New plugin can be added without editing core source.
- Plugin permissions display before enablement.
- Broken plugin is isolated/disabled.

### Milestone 7: Safe Actions

**Build**

- Action registry.
- Dry-run/preview.
- Confirmation and reason capture.
- Approval request flow.
- Idempotency and audit logs.

**Accept**

- Low-risk action can run after confirmation.
- High-risk action requires approval.
- All action runs have audit trail and rollback guidance.

### Milestone 8: Avalon Dogfood

**Build**

- Private Avalon identity mapping.
- Support-code lookup.
- Paid-user incident impact.
- Failed-payment/account-health views.
- Sync health and ops probes.

**Accept**

- Avalon daily ops review can run from the cockpit.
- Support can search a user/support code and see context in one page.
- Engineering can connect Sentry issue to affected paid users.

### Milestone 9: OSS Launch Prep

**Build**

- Demo seed data.
- Setup docs.
- Connector author guide.
- Plugin author guide.
- Security/threat model.
- Public/private boundary docs.

**Accept**

- Fresh user can run demo locally in under 10 minutes.
- Docs explain what not to put in the public repo.
- Security model is clear before public launch.

---

## 10. Verification Strategy

- Unit tests for connector schemas, tool schemas, manifest validation, redaction, policy, audit writes.
- Integration tests for each connector against mocked APIs/fixtures.
- E2E tests for dashboard load, Account 360, AI answer with citations, UI customization preview/apply/rollback, plugin install/disable.
- Security tests for permission bypass, prompt injection in external text, SSRF domains, secret leakage, unauthorized action execution.
- Dogfood checks against Avalon staging/private config before production usage.

---

## 11. Immediate Next Tasks

1. Configure Logria domain plan: logria.dev for OSS/docs, app.logria.dev for hosted workspaces; decide license.
2. Decide whether support v1 is Crisp-first or Chatwoot-first.
3. Scaffold app and core Prisma models.
4. Implement connector/tool/manifest/plugin schemas before UI feature work.
5. Build demo connectors and home dashboard.
6. Add AI operator read-only tool calls.
7. Add manifest-rendered dashboards and AI customization.
8. Add plugin SDK and sample plugin.
9. Wire Avalon-private dogfood layer.
