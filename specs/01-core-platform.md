# Spec 01: Core Platform

## Purpose

Create the secure foundation for the operations cockpit: workspace tenancy, authentication, authorization primitives, audit logging, app shell, and database structure.

## Scope

- Next.js/TypeScript app shell.
- Postgres + Prisma schema.
- Auth and workspace membership.
- Capability-based permission model.
- Immutable audit event pipeline.
- Base navigation and layout.
- Local development setup.

## Non-Goals

- Real third-party connectors.
- AI operator chat.
- Write/admin actions.
- Plugin execution.
- Avalon-private data integration.

## Data Model

Required models:

- `Workspace`
  - `id`, `name`, `slug`, `createdAt`, `updatedAt`.
- `User`
  - `id`, `email`, `name`, `image`, `createdAt`, `updatedAt`.
- `Membership`
  - `workspaceId`, `userId`, `role`, `status`, timestamps.
- `PermissionGrant`
  - `workspaceId`, `subjectType`, `subjectId`, `permission`, `scope`, `grantedBy`, timestamps.
- `AuditEvent`
  - `workspaceId`, `actorUserId`, `eventType`, `riskLevel`, `targetType`, `targetId`, `reason`, `metadata`, `createdAt`.

## Permission Model

Start with roles:

- `owner`
- `admin`
- `support`
- `engineering`
- `revenue`
- `auditor`

Represent access internally as capabilities, for example:

- `workspace.manage`
- `connector.manage`
- `connector.view_health`
- `account.view_basic`
- `account.view_sensitive`
- `revenue.view`
- `support.view`
- `incident.view`
- `product_analytics.view`
- `audit.view`
- `action.run_low_risk`
- `action.approve_high_risk`

Role checks must compile to capability checks; do not scatter role-string checks across UI/server code.

## UI Requirements

Pages:

- `/` command center placeholder.
- `/accounts` placeholder.
- `/ask` placeholder.
- `/revenue` placeholder.
- `/product` placeholder.
- `/incidents` placeholder.
- `/support` placeholder.
- `/operations` placeholder.
- `/compliance` placeholder.
- `/plugins` placeholder.
- `/settings/connectors` placeholder.
- `/audit` audit event list.

## Server Requirements

- Authenticated server helper: `requireUser()`.
- Workspace helper: `requireWorkspaceAccess(workspaceId)`.
- Permission helper: `requirePermission(workspaceId, permission)`.
- Audit helper: `emitAuditEvent(event)`.
- Request IDs and structured server errors.

## Acceptance Criteria

- A user can sign in and belong to a workspace.
- App shell renders all top-level routes.
- `AuditEvent` records can be created and listed from `/audit` by authorized users.
- Capability checks are enforced server-side.
- Unauthorized users cannot view workspace data.
- No secrets or server-only modules are imported into client components.

## Verification

- Prisma validation/generation succeeds.
- Unit tests cover role-to-capability mapping.
- Unit tests cover `requirePermission` allow/deny paths.
- Integration test covers writing and reading an audit event.
- E2E smoke test loads the app shell and denies an unauthorized route.
