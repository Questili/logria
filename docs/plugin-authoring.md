# Plugin Authoring

Logria plugins live under `plugins/<plugin-id>` in v1. Each plugin must include a `plugin.json` manifest.

## Manifest requirements

Declare:

- `id`, `name`, `version`, `publisher`, `license`.
- compatibility range.
- requested permissions and secrets.
- network domains.
- data categories accessed.
- contributed connectors, tools, widgets, actions, policies, or exports.
- risk levels and audit events emitted.
- whether demo fixtures are included.

## SDK helpers

`src/lib/plugins/sdk.ts` exposes typed helpers: `defineConnector`, `defineTool`, `defineWidget`, `defineAction`, `defineRedactionPolicy`, and `defineExport`.

## Review model

Plugins are disabled by default. Owner/admin review must inspect permissions, secrets, network domains, data categories, risk levels, and audit events before enablement.
