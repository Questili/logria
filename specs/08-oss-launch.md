# Spec 08: OSS Launch

## Purpose

Prepare the project for a credible open-source release with a safe demo, clear setup, strong security posture, plugin documentation, and a public/private boundary that protects Avalon.

## Scope

- Public README and positioning.
- License decision.
- Demo data and local setup.
- Docker Compose/self-host instructions.
- Connector setup guides.
- Plugin author guide.
- Security/threat model.
- Contribution guide.
- Launch checklist.

## Non-Goals

- Hosted SaaS offering.
- Public marketplace.
- Public Avalon production case study with sensitive metrics.

## Required Docs

- `DOMAIN_STRATEGY.md`: domain roles, hosted app routing, and brand boundaries.
- `README.md`: what it is, who it is for, quickstart, screenshots/GIFs.
- `docs/architecture.md`.
- `docs/security.md`.
- `docs/threat-model.md`.
- `docs/connectors.md`.
- `docs/plugin-authoring.md`.
- `docs/ui-manifests.md`.
- `docs/ai-safety.md`.
- `docs/public-private-boundary.md`.
- `CONTRIBUTING.md`.
- `SECURITY.md`.
- `LICENSE`.

## Demo Requirements

- Runs locally in under 10 minutes.
- Includes fake/demo connectors.
- Includes fake revenue, product, support, incident, and account data.
- AI operator works over demo data without real secrets.
- Customizable dashboard demo works without external APIs.
- Sample plugin works out of the box.

## Security Launch Requirements

- No real secrets in repo.
- Secret scanning configured.
- Dependency audit script configured.
- Threat model documents AI, connector, plugin, action, and data-exposure risks.
- Public docs state that the tool helps collect operational/compliance evidence but does not make a company compliant by itself.
- Plugin security warnings are explicit.

## Positioning

Use **Logria** as the public product name, **logria.dev** as the canonical OSS/docs domain, **app.logria.dev** as the hosted app domain, and **Merlin** as the AI assistant name. Public messaging should emphasize:

- AI-native operations cockpit.
- Evidence-linked answers.
- Safe admin workflows.
- Works with Metabase/PostHog/Sentry/Stripe/support tools.
- Open-source and self-hostable.
- Extensible plugin ecosystem.

## Acceptance Criteria

- Fresh clone can run demo locally with documented commands.
- README communicates product clearly in under 60 seconds.
- Demo shows command center, Account 360, AI operator, UI customization, and sample plugin.
- Security docs explain risk boundaries.
- Contribution path for connectors/plugins is clear.

## Verification

- Fresh-clone quickstart test.
- Secret scan.
- Dependency/security audit.
- Link check for docs.
- Demo walkthrough recording or screenshots.
- Public/private boundary review before publish.
