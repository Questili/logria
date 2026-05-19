# Spec 02: Connectors

## Purpose

Create the connector framework and first read-only integrations for Metabase, PostHog, Sentry, Stripe, and support tools.

## Scope

- Connector registry and lifecycle.
- Encrypted connector credentials.
- Connector health checks.
- Read-only tool contracts.
- Demo fixtures for local OSS demo.
- Source links and freshness metadata.

## Non-Goals

- State-changing connector actions.
- Arbitrary SQL editor.
- Plugin registry distribution.
- Direct replacement of source tools.

## Connector Contract

Each connector must export:

- `id`, `name`, `category`, `version`.
- Config schema.
- Secret schema.
- Health check function.
- Tool definitions.
- Source link builder.
- Redaction policy.
- Demo fixture provider.
- Tests.

Categories:

- `bi`
- `product_analytics`
- `observability`
- `billing`
- `support`
- `ops`
- `compliance`

Tool metadata:

- `toolId`
- `description`
- `inputSchema`
- `outputSchema`
- `requiredPermissions`
- `riskLevel`
- `sourceLinkFields`
- `cachePolicy`

## Data Model

Required models:

- `ConnectorInstallation`
  - workspace, connector ID, display name, status, config metadata.
- `ConnectorCredential`
  - installation ID, encrypted secret reference/value, rotation metadata.
- `ConnectorHealthCheck`
  - installation ID, status, latency, last success/failure, error summary.
- `SourceObjectLink`
  - workspace, source type, external object ID, source URL, display metadata.

## Initial Connectors

### Metabase

Read tools:

- list dashboards.
- list cards/questions.
- fetch card result.
- generate dashboard/card link.

### PostHog

Read tools:

- lookup person/account.
- fetch recent events.
- list insights or fetch insight summary.
- generate person/insight links.

### Sentry

Read tools:

- list unresolved issues.
- fetch issue details.
- fetch issue tag distribution / affected users.
- fetch event detail.
- generate issue/event links.

### Stripe

Read tools:

- lookup customer.
- fetch subscription status.
- list invoices/payment failures.
- generate customer/subscription/invoice links.

### Support

Support should be connector-neutral with first adapters for Crisp or Chatwoot.

Read tools:

- search conversations by email/domain.
- fetch conversation summary.
- list open conversations for an account.
- generate support conversation link.

## UI Requirements

- `/settings/connectors` lists installed connectors, health, and configure/test actions.
- Connector cards show status, freshness, and permission requirements.
- Failed connector states degrade dashboard cards gracefully.

## Acceptance Criteria

- Demo connectors work without secrets.
- Real connector credentials are stored server-side only.
- Each real connector has a health check.
- Each tool validates input and returns typed output.
- Connector failures return structured partial-state errors, not app crashes.
- Every connector output includes source/freshness metadata where available.

## Verification

- Unit tests for connector schemas.
- Unit tests for source-link generation.
- Mocked integration tests for each connector tool.
- Secret-leak test ensures credentials never serialize to client output.
- UI smoke test toggles a connector from healthy to failing and verifies graceful display.
