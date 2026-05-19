# Threat Model

## Assets

- Connector credentials and secret references.
- Customer/account data from revenue, support, product analytics, incidents, and ops systems.
- Audit logs, approval decisions, and action results.
- Plugin manifests and runtime contributions.
- AI prompts, tool calls, evidence links, and generated dashboard manifests.

## Primary threats

| Threat | Risk | Mitigation |
| --- | --- | --- |
| Connector secret leakage | High | Server-only connector contracts, redaction policies, tests, and secret scanning. |
| Cross-tenant data access | High | Workspace-scoped helpers and capability checks before every data/tool access. |
| Prompt injection from tickets/logs | High | Treat source text as data, sanitize obvious instruction attacks, never let source text override policy. |
| Unauthorized AI tool use | High | Tool metadata includes required permissions and risk level; Merlin enforces policy before calls. |
| Unsafe admin action | High | Dry-run, confirmation, approvals, idempotency, audit, and no destructive actions by default. |
| Malicious plugin | High | Plugins disabled by default; manifests declare permissions, secrets, network domains, risks, and audit events. |
| False compliance claims | Medium | Docs and UI state that Logria helps collect evidence but does not make a company compliant by itself. |

## Review before public launch

- Run secret scanning on the full repo and GitHub remote.
- Review plugin warning copy.
- Verify no Avalon private data or logic is present.
- Exercise demo mode from a fresh clone.
