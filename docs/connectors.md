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
