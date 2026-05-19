# Public / Private Boundary

Logria is public OSS. Avalon is the first dogfood product. The boundary is strict.

## Public and safe for this repo

- Generic connector contracts.
- Demo fixtures with fake accounts, incidents, revenue, and support data.
- Generic dashboard manifests.
- Generic policy, audit, redaction, plugin, and action framework code.
- Documentation for how a private integration should be structured.

## Private and excluded

- Avalon production credentials.
- Avalon customer/account identity mappings.
- Private SQL queries over production customer tables.
- Internal support playbooks, macros, or incident processes.
- Sensitive operational probes.
- Admin actions that affect real Avalon users.

## Dogfood approach

Use a private package/config layer for Avalon-specific dashboards and mappings. Upstream generic fixes to Logria only after data, queries, and playbooks are sanitized.
