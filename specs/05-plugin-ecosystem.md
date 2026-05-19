# Spec 05: Plugin Ecosystem

## Purpose

Enable the community and internal teams to extend the cockpit with connectors, widgets, AI tools, actions, policies, and exports without forking core code.

## Scope

- Plugin manifest schema.
- Local plugin loader.
- Plugin SDK interfaces.
- Plugin install/review UI.
- Permission/capability declaration.
- Sample plugin.
- Plugin health/isolation behavior.

## Non-Goals

- Public marketplace in v1.
- Runtime execution of untrusted arbitrary code without isolation.
- Automatically installing AI-generated plugins.

## Plugin Types

- Connector plugins.
- Widget plugins.
- Action plugins.
- AI tool plugins.
- Policy/redaction plugins.
- Export/report plugins.

## Plugin Manifest

Each `plugin.json` must declare:

- `id`, `name`, `version`, `publisher`.
- `license`, `homepage`, `repository`.
- compatibility range.
- requested permissions.
- requested secrets/env variables.
- network egress domains.
- data categories accessed.
- contributed connectors/tools/widgets/actions.
- risk levels.
- audit events emitted.
- demo fixtures.

## V1 Loading Model

- Plugins live in `plugins/<plugin-id>`.
- Core scans plugins at startup/dev refresh.
- Manifest is validated before enabling.
- Server contributions load only from approved entrypoints.
- Client widget contributions receive permission-checked data only.
- Broken plugin disables itself and reports health errors.

## Plugin SDK

Provide typed interfaces for:

- `defineConnector()`.
- `defineTool()`.
- `defineWidget()`.
- `defineAction()`.
- `defineRedactionPolicy()`.
- `defineExport()`.

## Install / Review UI

`/plugins` must show:

- installed plugins.
- available local plugins.
- requested permissions.
- secrets required.
- network domains.
- risk levels.
- health status.
- enable/disable controls.

## Security Rules

- Plugins are disabled by default.
- Owner/admin approval required to enable plugin.
- Plugin capabilities are explicit and narrow.
- Plugin server code cannot access arbitrary credentials.
- Plugin widgets cannot receive unredacted data unless explicitly permitted.
- Plugin actions use Spec 06 action gates.
- All plugin activity emits audit events.

## Acceptance Criteria

- A sample plugin adds one demo connector, one widget, and one AI read tool.
- Plugin can be enabled/disabled from UI.
- Plugin permissions are visible before enablement.
- Broken plugin does not crash the app.
- Plugin activity is auditable.

## Verification

- Manifest schema tests.
- Plugin loader tests for valid/invalid plugins.
- Permission review UI test.
- Broken plugin isolation test.
- E2E test: install sample plugin and render its widget.
