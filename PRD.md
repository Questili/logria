# PRD: Open-Source AI-Native SaaS Operations Cockpit

**Product name:** Logria  
**Primary domain:** logria.dev  
**Hosted app:** app.logria.dev  
**AI assistant name:** Merlin  
**Status:** Draft PRD  
**Owner:** Avalon  
**Target users:** SaaS founders, operators, support leads, product leads, engineering/on-call, finance/revenue owners  
**Initial dogfood app:** Avalon (`/Users/nishchay/code/avalon`)  
**Initial integrations:** Metabase, PostHog, Sentry, Stripe/revenue sources, support tools such as Crisp/Chatwoot  

> Note: this PRD interprets “pre-Sentriy support tools” as “Sentry plus support tools,” because the stated cockpit vision includes issue tracking/AIOps and support workflows.

---

## 1. Product Thesis

Modern SaaS teams run the business through fragmented tools: Stripe for revenue, PostHog for product usage, Metabase for BI, Sentry for errors, support tools for customer pain, and private scripts/admin panels for fixes. The result is slow diagnosis, unsafe manual operations, missing audit trails, and founders/operators asking the same cross-tool questions repeatedly.

This project is an **open-source, AI-native SaaS operations cockpit** that gives teams one safe command center to:

1. see what is happening across revenue, product, support, incidents, and operations;
2. ask natural-language questions against trusted sources;
3. trace answers back to source evidence;
4. perform approved operational actions with strict permissions, confirmations, and audit logs.

Avalon will use it internally first, while keeping the public project generic enough for other SaaS teams.

---

## 2. Goals

### Product Goals

- Provide a unified operator homepage for SaaS health: revenue, activation, usage, incidents, support, and system health.
- Let founders/operators ask questions such as:
  - “Why did MRR dip yesterday?”
  - “Which customers are affected by this Sentry issue?”
  - “Which paid users have failing mailbox sync?”
  - “Show support tickets from users with failed payments.”
  - “Summarize product adoption by plan over the last 30 days.”
- Turn scattered internal scripts into safe, permissioned, audited actions.
- Open-source the generic cockpit while keeping Avalon-specific queries, customer data, playbooks, and secrets private.
- Make Metabase/PostHog/Sentry/support tools more useful by connecting their outputs into workflows rather than replacing them.

### Business / Community Goals

- Create goodwill as a useful open-source contribution for modern SaaS teams.
- Establish Avalon’s credibility around operational intelligence, compliance-aware workflows, and AI-native operator UX.
- Build a platform that can later become an Avalon-adjacent enterprise/admin product if adoption validates the need.

### Engineering Goals

- Use a production-grade, maintainable stack aligned with Avalon: Next.js, TypeScript, Prisma/Postgres, `better-auth`, AI SDK/MCP-style tool calling, and audited server actions.
- Keep integrations modular but first-class: no brittle screen scraping, no unmanaged one-off scripts.
- Enforce clean API invariants: validate inputs up front, fail fast, avoid implicit global admin behavior.
- Default to read-only access; require explicit policy gates for write/admin actions.

---

## 3. Non-Goals

- Do not rebuild Metabase, PostHog, Sentry, Stripe, Chatwoot, or Crisp.
- Do not fork upstream tools unless there is a hard, validated limitation.
- Do not expose Avalon’s private metrics, customer mappings, support playbooks, or incident data in the open-source repo.
- Do not ship autonomous destructive actions.
- Do not make the AI assistant an unaudited SQL shell or root admin agent.
- Do not optimize for large enterprise ITSM workflows in v1; start with technical founders and small SaaS teams.

---

## 4. Target Users and Personas

### 4.1 Founder / CEO

Needs fast visibility into revenue, churn, support pain, incidents, and product adoption without opening seven tools.

**Top jobs:**

- Understand what changed since yesterday/last week.
- Identify at-risk accounts and revenue leaks.
- Ask cross-functional questions in natural language.
- Know whether an incident is commercially important.

### 4.2 Operator / Chief of Staff / Ops Lead

Owns daily health checks, support escalation, billing follow-up, manual ops, and recurring reports.

**Top jobs:**

- Run morning ops review.
- Triage support issues by customer value/impact.
- Trigger safe back-office tasks.
- Export/share concise status summaries.

### 4.3 Support Lead

Needs customer context before responding: plan, usage, errors, recent incidents, account health, billing status.

**Top jobs:**

- Search by email/domain/support code.
- See a customer timeline across support, product, billing, and errors.
- Escalate to engineering with evidence.
- Avoid asking customers for information already known internally.

### 4.4 Engineering / On-Call

Needs incident impact, affected users, deploy correlation, and safe remediation actions.

**Top jobs:**

- Connect Sentry issues to customer/account impact.
- Correlate errors with releases, feature flags, usage, and support tickets.
- Run idempotent operational probes or repairs.
- Preserve incident audit history.

### 4.5 Finance / Revenue Owner

Needs subscription, payment, refund, trial, churn, and dunning visibility.

**Top jobs:**

- Monitor MRR/ARR, payment failures, trials, churn risk.
- Identify high-value accounts with operational failures.
- Explain revenue changes using customer/product/support context.

---

## 5. Product Surface

### 5.1 Home: Company Health Command Center

A single landing page with compact, actionable modules:

- Revenue: MRR/ARR, new sales, churn, failed payments, trial conversions.
- Product: activation, retention, feature adoption, high-value workflows.
- Support: open tickets, urgent tickets, high-value affected users, SLA risk.
- Incidents: active Sentry issues, error spikes, affected accounts, release correlation.
- Operations: job failures, webhook failures, sync lag, queue backlog, external dependency health.
- Compliance: recent admin actions, pending data requests, access reviews, audit gaps.
- AI digest: “What changed and what needs attention?” with citations.

### 5.2 Ask / AI Operator Chat

Natural-language assistant over approved tools and datasets.

Required behavior:

- Always identify which source was used: Metabase question/card, PostHog insight, Sentry issue/event, Stripe object, support ticket, internal DB query, or ops action log.
- Return evidence links and query/action IDs where possible.
- Ask for clarification when a request could touch sensitive data or perform an action.
- Use read-only tools by default.
- Require confirmation, permission, and audit metadata before state-changing actions.
- Refuse or escalate requests that violate policy.

Example prompts:

- “Show revenue lost to failed renewals this week.”
- “Which paid customers had sync failures after the last deploy?”
- “Summarize Sentry issue `AVALON-WEB-123` with affected users and support tickets.”
- “Find users who contacted support and have not activated Flowboard.”
- “Create an incident note for the Microsoft Graph outage.”

### 5.3 Customer / Account 360

Search by email, domain, organization, customer ID, support code, Stripe customer ID, Sentry user ID, or PostHog distinct ID.

Show:

- Identity and account metadata.
- Plan/subscription/payment status.
- Product usage and activation milestones.
- Recent support conversations.
- Recent errors/incidents affecting the user.
- Operational health: sync status, token state, webhook/job failures.
- Admin timeline and audit trail.
- Safe actions available to the current operator.

### 5.4 Revenue Ops

- Stripe/Lemon Squeezy or other billing connector support.
- MRR/ARR movement and explanations.
- Failed payments and dunning queues.
- Trial-to-paid funnel.
- Refund/cancel history.
- High-value customers with active incidents/support tickets.

V1 action examples:

- Open billing customer in source provider.
- Mark internal follow-up needed.
- Generate dunning/support summary.

Post-v1 audited actions:

- Apply credit/coupon.
- Trigger billing portal link.
- Retry internal entitlement sync.

### 5.5 Product Analytics

Use PostHog and/or warehouse-backed Metabase as source of truth.

- Activation funnel.
- Retention cohorts.
- Feature adoption.
- AI/tool usage.
- Power-user workflows.
- Drop-off and error correlation.
- Account-level usage timeline.

### 5.6 Incident / AIOps

Use Sentry as primary issue/error source in v1.

- Active issue feed with customer impact.
- Error spike detection.
- Affected paid users/accounts.
- Release/deploy correlation.
- Support-ticket correlation.
- Suggested next diagnostic query.
- Incident summaries for Slack/status/customer support.

Action examples:

- Link issue to internal incident.
- Create support macro/draft.
- Trigger safe probe.
- Mark issue as known/stale only when policy permits.

### 5.7 Support Ops

Initial support connector options:

- Crisp for Avalon dogfood, because Avalon already has Crisp support configuration.
- Chatwoot as open-source support desk option.
- Generic support connector interface for Zendesk/Intercom/Front later.

Capabilities:

- Ticket/conversation search.
- Customer context sidebar.
- Support code lookup.
- AI support summary with internal-only facts clearly separated from customer-safe text.
- Escalation to incident or engineering queue.

### 5.8 Operations / Jobs / Webhooks

- Queue health.
- Webhook failure health.
- Cron/scheduled task health.
- External dependency probes.
- Idempotency/retry visibility.
- Safe rerun actions with dry-run mode.

Avalon dogfood can draw from existing ops/readiness scripts and probes in the main repo, but the open-source platform should define a generic “ops probe/action” contract.

### 5.9 Compliance / Audit

- Immutable admin action log.
- AI query/action log.
- Data access log for sensitive account views.
- Approval workflow for high-risk actions.
- Exportable evidence for access reviews and incident reviews.
- Policy surface for data redaction and retention.

Avalon already has compliance/audit concepts and scripts; this project should reuse those patterns conceptually while keeping public implementation generic.

---

## 6. MVP Scope

### MVP Principle

Ship a useful, read-mostly cockpit before building powerful admin actions.

### MVP Modules

1. **Home dashboard** with health cards and source links.
2. **Metabase connector** for saved questions/cards/dashboards and SQL-backed answer retrieval.
3. **PostHog connector** for product analytics, event/person lookup, and insight links.
4. **Sentry connector** for issues, events, affected users, releases, and error summaries.
5. **Support connector v1** for Crisp or Chatwoot conversations.
6. **Revenue connector v1** for Stripe objects and subscription/account lookup.
7. **Account 360** combining billing, analytics, support, incidents, and internal account data.
8. **AI Operator Chat** over read-only tools with citations.
9. **Audit log** for all sensitive views, AI queries, and actions.
10. **Role policy** for founder/admin/support/engineering/revenue roles.

### MVP Explicit Cuts

- No autonomous refunds, account disablement, data deletion, or user impersonation.
- No custom BI engine.
- No custom support inbox.
- No workflow builder UI in v1.
- No public cloud-hosted service requirement; self-host/open-source first.
- No plugin marketplace in v1.

---

## 7. Functional Requirements

### 7.1 Connector Framework

Each connector must define:

- `id`, `name`, `category`, `authType`, `capabilities`.
- Read tools with input schemas and output schemas.
- Optional write tools with risk classification.
- Health check.
- Rate-limit behavior.
- Source link generation.
- Redaction rules.
- Test fixture/demo mode.

Connector categories:

- `bi`: Metabase, Superset later.
- `product_analytics`: PostHog.
- `observability`: Sentry, SigNoz later.
- `support`: Crisp, Chatwoot, Zendesk/Intercom later.
- `billing`: Stripe, Lemon Squeezy, Paddle later.
- `ops`: internal jobs, queues, webhooks, probes.
- `compliance`: audit logs, access reviews, DSAR exports/deletes.

### 7.2 AI Tool Registry

- Tools are server-side only.
- Every tool has a JSON-schema-safe input schema.
- Tool outputs are structured, redacted, and source-linked.
- Tools declare `riskLevel`: `read`, `sensitive_read`, `low_write`, `high_write`, `destructive`.
- Tools declare required permissions.
- High-risk tools require confirmation and reason capture.
- Destructive tools are disabled by default.

### 7.3 Permissions and Roles

Default roles:

- `owner`: all read access, can manage policy/connectors, can approve high-risk actions.
- `admin`: broad ops access, limited connector management.
- `support`: account/support/customer context, no finance-sensitive exports by default.
- `engineering`: incidents, logs, ops probes, customer impact where needed.
- `revenue`: billing/revenue/customer subscription context.
- `auditor`: read-only audit/compliance evidence.

Permissions should be capability-based, not role-string checks scattered through the codebase.

### 7.4 Action Safety

All state-changing actions require:

- authenticated operator;
- permission check;
- validated input;
- target object resolution;
- preview/dry-run result where feasible;
- explicit confirmation;
- reason/comment;
- idempotency key;
- audit event;
- source/result link;
- rollback guidance where applicable.

### 7.5 Evidence and Citations

Every AI answer must include at least one of:

- source tool call ID;
- Metabase card/question/dashboard link;
- PostHog insight/person/event link;
- Sentry issue/event/release link;
- Stripe/customer/subscription link;
- support conversation link;
- internal audit/action/query ID.

If the assistant cannot cite evidence, it must say the answer is incomplete.

---

## 8. Non-Functional Requirements

### Security

- No secrets exposed to client bundles.
- Connector credentials encrypted at rest.
- Least-privilege API tokens per connector.
- Strict tenant boundary checks.
- Sensitive account views audited.
- Redaction before AI context assembly.
- Prompt-injection defenses for support tickets, event text, logs, and external content.
- SSRF protection for connector URLs and webhooks.

### Privacy and Compliance

- Configurable retention for AI logs and audit logs.
- Redact secrets, tokens, message content, and payment details by default.
- Support export/delete workflows for self-hosted deployments.
- Clear public docs: the project helps with evidence collection but does not make a company “SOC 2 compliant.”

### Reliability

- Connector failures must degrade gracefully.
- Each source card shows freshness and health.
- AI answers must identify missing/unavailable sources.
- Background sync jobs are idempotent.
- Cached summaries must show timestamp and source revision.

### Performance

- Home dashboard initial load target: under 2.5s for cached health cards.
- Account 360 target: under 5s with parallel connector fetches and clear partial states.
- AI answer target: stream first useful response under 3s when using cached metadata; longer evidence queries must show progress.

### Maintainability

- Connector contracts live in one canonical package/module.
- Business policy lives in one canonical policy layer.
- UI should use shared components and small files; avoid creating a giant dashboard component.
- Tests must cover connector schema validation, permission gates, redaction, and audit logging.

---

## 9. Suggested Technical Architecture

### 9.1 Stack

Based on Avalon’s current stack and open-source maintainability:

- Next.js App Router + React + TypeScript.
- Postgres + Prisma.
- `better-auth` or compatible auth layer.
- AI SDK tool calling, with MCP-compatible connector direction where useful.
- TanStack Table/Virtual for dense operational tables.
- Radix/shadcn-style primitives for accessible UI.
- Optional Docker Compose for local self-hosting.

### 9.2 App Structure

Proposed high-level modules:

```text
apps/web/
  app/
    (ops)/
      page.tsx                    # command center
      ask/page.tsx                # AI operator chat
      accounts/[id]/page.tsx      # account 360
      revenue/page.tsx
      product/page.tsx
      incidents/page.tsx
      support/page.tsx
      operations/page.tsx
      compliance/page.tsx
  server/
    connectors/
      metabase/
      posthog/
      sentry/
      stripe/
      support-crisp/
      support-chatwoot/
    ai/
      tool-registry.ts
      operator-chat.ts
      redaction.ts
      evidence.ts
    policy/
      permissions.ts
      risk-levels.ts
      approvals.ts
    audit/
      audit-store.ts
      audit-events.ts
  components/
    command-center/
    account-360/
    ai-operator/
    source-cards/
```

For Avalon dogfood, this can either live as:

1. a separate repo/app in `/Users/nishchay/code/avalon-godView`; or
2. a package/app inside the Avalon monorepo later if shared auth/schema coupling becomes important.

Start separate to keep open-source boundaries clean.

### 9.3 Data Model Concepts

Core models:

- `Workspace`
- `User`
- `Membership`
- `ConnectorInstallation`
- `ConnectorCredential`
- `SourceObjectLink`
- `AccountIdentityMap`
- `SavedView`
- `AIOperatorThread`
- `AIToolCall`
- `AuditEvent`
- `ApprovalRequest`
- `OpsActionRun`
- `IncidentLink`
- `SupportLink`

### 9.4 Public vs Avalon-Private Boundary

Open-source repo includes:

- Generic connector framework.
- Generic Metabase/PostHog/Sentry/Stripe/Crisp/Chatwoot connectors.
- Generic dashboard shell.
- Generic AI operator chat.
- Generic audit/permission/action framework.
- Demo data and demo connectors.
- Self-host docs.

Avalon-private layer includes:

- Avalon-specific account identity mapping.
- Avalon-specific queries and dashboards.
- Avalon customer/admin actions.
- Real support macros/playbooks.
- Real compliance evidence paths.
- Internal incident runbooks.
- Any secrets or production environment config.

---

## 10. Integration Requirements

### 10.1 Metabase

Use for:

- saved BI questions/cards/dashboards;
- SQL-backed metrics;
- exec reporting;
- revenue/product/support composite dashboards.

Required features:

- list dashboards/cards;
- fetch card results where permitted;
- generate source links;
- optional embedded dashboard cards;
- AI can reference Metabase results as evidence.

### 10.2 PostHog

Use for:

- product analytics;
- funnels/cohorts/retention;
- feature flag context;
- person/account activity;
- session/replay links where available and permitted.

Required features:

- search person/account;
- fetch recent events;
- link to insights/persons;
- summarize adoption and anomalies.

### 10.3 Sentry

Use for:

- issue tracking;
- affected user impact;
- release/deploy correlation;
- error/event evidence;
- incident summaries.

Required features:

- list active issues;
- fetch issue/event detail;
- search affected users/tags;
- link issue to account/support context;
- never resolve/ignore issues automatically in v1.

### 10.4 Support Tools

Initial support tools:

- Crisp for Avalon dogfood.
- Chatwoot for open-source/self-host friendly support.

Required features:

- search conversations by email/domain/user;
- fetch conversation summary and source link;
- show support status on Account 360;
- generate internal summary and customer-safe draft separately.

### 10.5 Billing / Revenue

Initial billing:

- Stripe first, because Avalon already uses Stripe fields and scripts.
- Lemon Squeezy support later if needed because Avalon also has Lemon Squeezy dependency/config.

Required features:

- customer lookup;
- subscription status;
- payment failures;
- trial/conversion state;
- revenue dashboard links;
- safe read-only v1 behavior.

---

## 11. UX Principles

- **Operator-first density:** compact, useful, source-linked cards; avoid fluffy AI output.
- **Evidence over vibes:** every claim needs a source.
- **Safe by default:** read-only until the operator intentionally acts.
- **Show freshness:** every card/query shows last updated time and source health.
- **Explain uncertainty:** partial data is allowed, silent confidence is not.
- **Customer-safe separation:** internal diagnosis and customer-facing text must be visibly distinct.
- **Fast path to source:** every object links back to Metabase/PostHog/Sentry/Stripe/support.

---

## 12. Success Metrics

### Dogfood Success

- Avalon team uses the cockpit for daily ops review.
- At least 10 recurring ops questions are answered faster than before.
- Support lookup time drops materially because account context is unified.
- Incident triage includes revenue/customer impact without manual joins.
- Admin/sensitive views are audited automatically.

### Open-Source Success

- Public repo ships a working demo in under 10 minutes locally.
- At least 3 useful connectors work without code changes.
- Early users can connect Metabase/PostHog/Sentry or demo sources.
- GitHub stars/issues/discussions indicate real operational use, not just curiosity.
- External contributors can add connectors using the documented contract.

### Product Metrics

- Daily/weekly active operators.
- Questions asked per operator.
- Percentage of AI answers with valid evidence links.
- Time-to-triage support/incident/account lookup.
- Number of audited actions/views.
- Connector health and failure rate.

---

## 13. Milestones

### Phase 0: Foundation and Repo Shape

- Confirm DNS/hosting plan for logria.dev and app.logria.dev.
- Pick license.
- Scaffold Next.js/TypeScript/Postgres/Prisma app.
- Define connector contract, policy model, audit event schema, and demo mode.
- Add local Docker Compose.
- Add public/private boundary docs.

### Phase 1: Read-Only Intelligence MVP

- Metabase connector.
- PostHog connector.
- Sentry connector.
- Stripe read-only connector.
- Support connector for Crisp or Chatwoot.
- Home dashboard.
- Account 360.
- AI operator chat with citations.
- Audit logging for sensitive views and AI tool calls.

### Phase 2: Avalon Dogfood

- Map Avalon user/account/subscription/support identities.
- Add Avalon-specific private queries/views.
- Add Avalon support-code lookup.
- Add mailbox/sync health cards.
- Add incident impact views for paid users.
- Run daily ops review from the cockpit.

### Phase 3: Safe Actions

- Add action framework with dry-run, confirmations, approvals, idempotency, and audit logs.
- Implement low-risk actions first:
  - create internal follow-up;
  - generate support summary;
  - trigger read-only probe;
  - retry idempotent sync/status refresh.
- Keep destructive actions disabled by default.

### Phase 4: Open-Source Launch

- Publish demo data and setup guide.
- Publish connector authoring guide.
- Publish security model and threat model.
- Publish “how this works with Metabase/PostHog/Sentry” guides.
- Share Avalon dogfood story without customer data.

---

## 14. Risks and Mitigations

| Risk | Severity | Why It Matters | Mitigation |
|---|---:|---|---|
| Scope explosion | High | This can become BI + support + observability + workflow automation all at once. | MVP is read-only cockpit + three/five connectors; no workflow builder v1. |
| Security exposure | High | Admin tools can leak data or perform dangerous actions. | Least privilege, redaction, audit logs, confirmation gates, no destructive actions by default. |
| AI hallucination | High | Operators may act on wrong summaries. | Evidence-required answers, source links, uncertainty states, no uncited claims. |
| Upstream maintenance tax | Medium | Forking Metabase/PostHog/Chatwoot/Sentry would be expensive. | Integrate via APIs/embed/MCP-style connectors; do not fork. |
| Weak OSS adoption | Medium | “Another dashboard” may not excite users. | Position around AI-native safe operations and cross-tool evidence/action layer. |
| Avalon-private leakage | High | Open source could expose internal logic/data. | Separate generic public repo from private Avalon connector/config package. |
| Connector fragility | Medium | SaaS APIs change and rate limits bite. | Health checks, typed contracts, graceful degradation, fixtures. |

---

## 15. Open Questions

1. Naming/brand: should Logria use logria.dev as the canonical OSS/docs site and app.logria.dev for hosted workspaces?
2. License: MIT/Apache for maximum adoption, or AGPL/dual-license for stronger commercial protection?
3. Should v1 use `better-auth` directly, or an auth abstraction to support more self-hosters?
4. Which support connector ships first publicly: Chatwoot, Crisp, or both?
5. Should Metabase be required, or should direct Postgres/warehouse querying also be a first-class path?
6. How much of Avalon’s existing compliance/audit machinery should be ported versus reimplemented generically?
7. Do we include a workflow runner integration such as Windmill later, or build only a narrow action framework?

---

## 16. First Implementation Slice

The smallest useful implementation for this repo:

1. Scaffold the app shell.
2. Add auth and workspace model.
3. Add connector installation model and encrypted credential storage.
4. Add audit event model.
5. Add mock/demo connectors for Metabase, PostHog, Sentry, Stripe, and support.
6. Build Home dashboard from demo connectors.
7. Build Account 360 from demo connectors.
8. Add AI operator chat over demo/read-only tools with citations.
9. Wire one real connector first, preferably Sentry or Metabase, because both demonstrate evidence-linked answers quickly.
10. Add Avalon-private identity mapping only after the generic contract is stable.

---

## 17. Avalon Grounding Notes

This PRD is intentionally aligned with Avalon’s existing realities:

- Avalon is a Next.js/TypeScript app using Prisma/Postgres, `better-auth`, AI SDK providers, Sentry, PostHog, Stripe, Crisp, Microsoft Graph, Slack, and compliance/readiness scripts.
- Avalon already has support-code patterns, Sentry request tagging, PostHog provider usage, Stripe subscription fields, organization roles, admin/support gating, and compliance/audit concepts.
- The open-source cockpit should reuse these lessons, not expose Avalon-private implementation details.
- The first dogfood value is likely: paid-user incident impact, support-code lookup, failed-payment context, activation/Flowboard usage, sync health, and operator audit history.

---

## 18. AI-Customizable Workspace and UI

A core differentiator should be that each team can shape the cockpit through conversation instead of filing tickets or hand-editing JSON.

### Product Intent

Operators should be able to say or type:

- “Move revenue and incidents to the top for my morning review.”
- “Create a founder view that shows MRR, churn risk, high-value support issues, and active incidents.”
- “Make a support lead dashboard for this week’s unresolved paid-user tickets.”
- “Add a customer health card that combines subscription status, activation, recent errors, and support tickets.”
- “Hide engineering-only widgets from revenue users.”

The AI should translate those requests into a safe workspace configuration, preview the change, and apply it only after confirmation.

### Safety Model

AI-customized UI must not mean arbitrary AI-written production code by default. The safe v1 model is:

1. **Declarative UI manifests**: dashboards, cards, tables, filters, layouts, and actions are represented as typed JSON/DSL.
2. **Sandboxed generation**: the AI can generate or edit manifests in an isolated sandbox with schema validation.
3. **Capability-bound widgets**: generated UI can only call registered connectors/tools the user has permission to use.
4. **Preview before publish**: users see a diff/preview before the new workspace is saved.
5. **Versioning and rollback**: every AI UI change creates a version with author, prompt, diff, and rollback.
6. **Policy gates**: AI cannot create widgets that bypass permissions, expose hidden fields, or invoke restricted actions.
7. **Admin approval for shared views**: personal layouts can be self-applied; team/global layouts require owner/admin approval.

### Customization Levels

- **Level 1: Personal layout** — reorder/hide/show existing cards and dashboards.
- **Level 2: Saved views** — create filtered dashboards from existing connector data.
- **Level 3: Composed cards** — combine multiple source outputs into a new read-only widget.
- **Level 4: Workflow panels** — create guided action panels using approved low-risk actions.
- **Level 5: Custom plugin widgets** — install or generate plugin-backed widgets through the plugin system.

V1 should support Levels 1-3. Levels 4-5 come after the action/plugin security model is mature.

### Acceptance Criteria

- A user can generate a new personal dashboard from a chat prompt.
- The generated dashboard is stored as a validated manifest, not arbitrary code.
- The user can preview, apply, revert, and duplicate the dashboard.
- Permission changes immediately affect generated dashboards.
- Every generated layout records the prompt, model/provider, diff, and operator ID.

---

## 19. Open Plugin Ecosystem

The cockpit should be open-source and extensible through a plugin ecosystem so the community can add connectors, widgets, actions, and AI tools without forking the core app.

### Plugin Types

- **Connector plugins**: add data sources such as HubSpot, Linear, GitHub, Zendesk, Supabase, ClickHouse, Snowflake, Slack, Datadog, Grafana, or custom APIs.
- **Widget plugins**: add visual cards, tables, timelines, funnels, maps, incident panels, or account health components.
- **Action plugins**: add safe operational actions with risk levels, approvals, and audit logging.
- **AI tool plugins**: expose structured tools to the AI operator chat.
- **Policy plugins**: extend permission, redaction, retention, or approval policies.
- **Export plugins**: generate reports, incident summaries, board packets, or compliance evidence bundles.

### Plugin Manifest Requirements

Each plugin must declare:

- name, version, publisher, license, homepage, repository;
- required environment variables/secrets;
- requested permissions and risk levels;
- connector/tool/widget/action capabilities;
- data categories accessed;
- network egress domains;
- audit events emitted;
- compatibility range with the core app;
- optional screenshots/demo fixtures.

### Security Requirements

- Plugins are disabled by default until installed by an owner/admin.
- Plugins run with explicit capabilities, not ambient app access.
- Secrets are stored by the host, not exposed to plugin UI code.
- Server-side plugin execution is sandboxed or isolated by process/container where practical.
- Client widgets receive only redacted, permission-checked data.
- High-risk action plugins require confirmation, reason capture, idempotency, and audit logs.
- Public plugin registry should support signing, checksums, publisher identity, and security advisories.

### Ecosystem Roadmap

- V1: local plugins loaded from the filesystem/repo.
- V2: private organization plugin registry.
- V3: public plugin directory with verified publishers and security metadata.
- V4: AI-assisted plugin scaffolding that generates a plugin from an OpenAPI schema, SQL schema, or example API docs, then runs validation/tests before install.

### Acceptance Criteria

- A developer can add a new connector plugin without modifying core source files.
- A plugin can contribute at least one connector, one widget, and one AI tool.
- Plugin permissions are visible before install.
- Plugin activity appears in audit logs.
- A broken plugin cannot crash the entire cockpit.
