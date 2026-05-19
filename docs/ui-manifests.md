# UI Manifests

Logria dashboards are declarative JSON manifests. Merlin may generate manifest patches, but not arbitrary React code.

## Dashboard fields

- `schemaVersion`, `id`, `title`, `description`.
- `scope`: personal, team, or global.
- `layout`: grid sections and widget order.
- `widgets`: typed widget definitions with bindings and permission requirements.
- `filters`, `requiredPermissions`, and `freshnessPolicy`.
- author and timestamps.

## Safety rules

- Invalid manifests never become active.
- Unauthorized sources/widgets are rejected during validation.
- Personal dashboards are isolated to the user.
- Team/global dashboards require admin approval.
- Permission revocation must affect rendered dashboards immediately.
