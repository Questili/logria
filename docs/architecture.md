# Architecture

Logria is a Next.js App Router application backed by Postgres through Prisma. The app has three public surfaces:

1. `/` for `logria.dev` positioning and docs links.
2. `/app/*` for the cockpit at the hosted direction `app.logria.dev`.
3. `/docs/*` for lightweight rendered Markdown docs in the demo app.

## Core layers

- **Core platform:** workspace tenancy, demo auth, memberships, capability checks, and audit events.
- **Connectors:** typed connector definitions for Metabase, PostHog, Sentry, Stripe, and support tools. Demo fixtures run with no external secrets; real credentials remain server-side.
- **Merlin:** server-side operator that selects permission-checked tools, redacts inputs/outputs, and returns evidence-linked answers.
- **Dashboards:** declarative manifests validated before rendering. AI customization produces manifest patches, not executable React.
- **Plugins:** local plugin manifests under `plugins/<plugin-id>` are validated and disabled by default until owner/admin review.
- **Safe actions:** low-risk actions use dry-run, confirmation, reason capture, idempotency, and audit. High-risk/destructive actions require approval and are not enabled by default.

## Data model

`prisma/schema.prisma` defines the persistent model for workspaces, users, memberships, permission grants, connectors, credentials, health checks, source links, AI threads/messages/tool calls, evidence, dashboard manifests/versions, plugins, approvals, and action runs.

## Public/private boundary

Avalon is the initial dogfood app, but Avalon customer mappings, production credentials, support playbooks, private dashboards, and admin actions do not belong in the public Logria repo.
