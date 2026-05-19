# AI Safety

Merlin is an operator assistant over registered tools. It is not a raw SQL shell, root admin, or autonomous destructive agent.

## Requirements

- Resolve permissions before tool calls.
- Use read-only and sensitive-read tools only in v1 chat.
- Redact secrets, tokens, payment-card-like values, raw credentials, and unnecessary PII before model context.
- Treat external source text as untrusted data.
- Include evidence links for factual claims.
- Refuse secret extraction and unsupported certainty.
- Route actions through preview/confirmation/approval flows.

## Demo mode

The local demo uses deterministic server-side logic over fake data so contributors can verify the UX without model-provider keys or third-party credentials.
