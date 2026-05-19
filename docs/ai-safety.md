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


## Provider mode

Set `LOGRIA_AI_MODE=openai` and `OPENAI_API_KEY` to route Merlin through the OpenAI Responses API with function tools generated from Logria's server-side tool registry. Demo mode remains the default so local contributors can run without model-provider credentials.
