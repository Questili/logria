# Spec 07: Avalon Dogfood Layer

## Purpose

Connect the generic open-source cockpit to Avalon privately so Avalon can dogfood the product without leaking Avalon-specific customer data, queries, admin actions, or internal playbooks into the public repo.

## Scope

- Private Avalon connector/config package or local integration layer.
- Avalon identity mapping.
- Support-code lookup.
- Paid-user incident impact.
- Billing/subscription context.
- Product adoption context.
- Sync/ops health views.
- Avalon-specific dashboards and saved prompts.

## Non-Goals

- Public release of Avalon customer mappings.
- Public release of internal support macros or incident playbooks.
- Destructive Avalon admin actions in early dogfood.

## Private Boundary

Keep private:

- Avalon production credentials.
- SQL queries over customer tables.
- customer/account identity mappings.
- internal incident/support playbooks.
- sensitive operational probes.
- admin action implementations that affect real users.

Can contribute upstream generically:

- connector improvements.
- manifest renderer improvements.
- generic policy/audit fixes.
- docs and demo fixtures with fake data.

## Initial Avalon Views

- Paid-user incident impact: Sentry issue -> affected Avalon users/accounts -> subscription status.
- Support-code lookup: support code/request ID -> route/error/user context.
- Failed-payment context: Stripe status -> product activity/support/error context.
- Activation health: onboarding, Flowboard usage, assistant usage, calendar/briefing adoption.
- Sync health: mailbox/provider token status, webhook/job lag, retry status.
- Daily ops review: combined digest of revenue, incidents, support, product usage, ops failures.

## Integration Requirements

- Use read-only DB/API access first.
- Map Avalon users/accounts to Stripe/PostHog/Sentry/support identities through explicit identity mapping.
- Audit every sensitive account view.
- Keep private dashboards as manifests in private config, not in the public repo.
- Use staging/demo data before production.

## Acceptance Criteria

- Avalon operator can search by email/support code and see Account 360.
- Engineering can view Sentry issue impact by paid customer.
- Support can see billing/product/error context in one page.
- Daily ops review can run from the cockpit.
- All sensitive views are audited.
- Public repo remains free of Avalon secrets/customer-specific logic.

## Verification

- Secret scan on public repo and private config boundaries.
- Staging smoke test with fake/sanitized Avalon data.
- Audit log check for account/support-code lookup.
- Manual daily ops review dogfood checklist.
