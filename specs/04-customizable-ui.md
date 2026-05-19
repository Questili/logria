# Spec 04: AI-Customizable UI

## Purpose

Allow users to customize dashboards and operational views by chat or voice while keeping the system safe through declarative manifests, validation, preview, versioning, and rollback.

## Scope

- Dashboard manifest schema.
- Manifest renderer.
- AI-generated manifest patches.
- Sandbox validation.
- Preview/apply/discard workflow.
- Version history and rollback.
- Personal/team/global dashboard scopes.

## Non-Goals

- Arbitrary AI-generated React code in v1.
- User-installed plugin widgets; covered by Spec 05.
- Write/admin workflow panels; covered after Spec 06.

## Customization Levels

V1 supports:

1. Personal layout: reorder/hide/show existing widgets.
2. Saved views: configure filters and source bindings.
3. Composed cards: combine multiple read-only source outputs.

Later versions support:

4. Workflow panels with safe actions.
5. Plugin-generated custom widgets.

## Manifest Requirements

A `DashboardManifest` must include:

- `schemaVersion`.
- `id`, `title`, `description`.
- `scope`: personal/team/global.
- `layout`: grid sections and ordering.
- `widgets`: typed widget definitions.
- `filters`: shared dashboard filters.
- `bindings`: connector/tool/saved-query references.
- `requiredPermissions`.
- `freshnessPolicy`.
- `createdBy`, `updatedBy`, timestamps.

A `WidgetManifest` must include:

- widget type.
- title/description.
- data binding.
- display config.
- empty/error states.
- source/evidence link behavior.
- permission requirements.

## AI Generation Flow

1. User asks for dashboard/layout change.
2. AI generates a manifest patch, not executable code.
3. Validator checks schema, bindings, permissions, widget compatibility, renderability, and risk.
4. System renders preview.
5. User applies, saves draft, or discards.
6. System writes version and audit event.
7. User can roll back.

## Data Model

Required models:

- `DashboardManifest`.
- `DashboardVersion`.
- `WidgetManifest` or embedded widget JSON.
- `LayoutPreference`.

## Safety Rules

- Generated manifests cannot reference connectors/tools the user lacks permission to use.
- Generated manifests cannot request hidden fields.
- Team/global dashboards require admin approval.
- Personal dashboards are isolated per user.
- Invalid manifests never persist as active versions.
- Permission revocation immediately affects generated dashboards.

## UI Requirements

- `/dashboards` list personal/team/global dashboards.
- `/dashboards/[id]` render manifest.
- `/dashboards/[id]/edit` chat-assisted editor with preview/diff.
- Version history drawer.
- Rollback action.

## Acceptance Criteria

- User creates a new personal dashboard from chat.
- User reorders widgets from chat.
- Invalid widget binding is rejected before save.
- Unauthorized field/source is rejected.
- User can preview and apply a manifest patch.
- User can rollback to a previous version.

## Verification

- JSON schema tests for dashboard/widget manifests.
- Unit tests for permission-aware manifest validation.
- Snapshot/render tests for manifest renderer.
- E2E test: chat prompt creates dashboard, preview appears, apply works, rollback works.
- Security test: malicious prompt cannot create unauthorized revenue/support widget.
