# Connector Guide

Connectors are first-class integrations, not screen scrapers or ad-hoc scripts. Each connector defines metadata, config schema, secret schema, health check, tools, source-link builder, redaction policy, and demo fixtures.

## Included connector definitions

- **Metabase:** dashboard/card/question read tools.
- **PostHog:** person, event, and insight summary read tools.
- **Sentry:** unresolved issue and affected-account read tools.
- **Stripe:** customer/subscription/invoice/revenue movement read tools.
- **Support:** connector-neutral Chatwoot/Crisp-style conversation search.

## Rules

- Secrets stay server-side.
- Tool inputs and outputs must validate with schemas.
- Every factual output should include source/freshness metadata.
- Failures should return partial-state errors instead of crashing app routes.
- Write/admin connector actions must go through the safe action framework.


## Real read-only adapters

The connector client layer now includes real read-only HTTP adapters with injectable `fetch` for mocked integration tests:

- Metabase uses `x-api-key` and reads `/api/dashboard`, `/api/card`, and `/api/card/:id/query/json`.
- PostHog uses `Authorization: Bearer <personal API key>` and reads `/api/projects/:project_id/persons/`, `/api/projects/:project_id/query/`, and `/api/projects/:project_id/insights/:id/`.
- Sentry uses `Authorization: Bearer <token>` and reads organization/project issues plus issue details/events under `/api/0`.
- Stripe uses bearer auth and reads customers search, subscriptions, and invoices from `/v1`.
- Chatwoot uses `api_access_token` and reads contacts/conversations under `/api/v1/accounts/:account_id`.

If the matching server-side environment variables are present, Merlin's registered tools use these real adapters. Without them, Logria stays in deterministic demo mode for the OSS quickstart.
