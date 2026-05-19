# Contributing

Thanks for contributing to Logria.

## Local setup

```bash
pnpm install
cp .env.example .env.local
pnpm prisma:validate
pnpm dev
```

## Before opening a PR

Run the smallest checks relevant to your change. For broad changes, run:

```bash
pnpm verify
```

## PR format

Include:

- **Why:** 1–2 bullets.
- **How:** 1–3 bullets.
- **Tests:** commands run and results.

## Boundaries

Do not commit real secrets, Avalon private data, customer mappings, production SQL, support playbooks, or destructive admin actions.
