# Security Model

Logria is designed around least privilege, evidence, and auditability.

## Invariants

- Connector secrets are server-side only and must never serialize into client props or API responses.
- Role checks compile to capabilities; application code should call capability helpers instead of scattering role-string checks.
- External source text from tickets, errors, dashboards, and events is untrusted data, not instructions.
- Merlin can call only registered, permission-checked, audited tools.
- AI-generated UI customization is limited to validated manifest patches.
- Low-risk writes require preview, confirmation, reason capture, idempotency, and audit.
- High-risk/destructive writes require approval and are disabled by default in the demo.

## Local security checks

Run:

```bash
pnpm secret:scan
pnpm test
pnpm prisma:validate
```

The secret scan is intentionally conservative and should be supplemented with hosted GitHub secret scanning before public launch.
