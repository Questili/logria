# Spec 03: AI Operator

## Purpose

Build the AI chat/operator layer that answers cross-tool operational questions with source evidence and strict permission boundaries.

## Scope

- AI chat UI.
- Server-side tool registry.
- Intent classification.
- Tool execution with permissions.
- Evidence-linked answers.
- Redaction and prompt-injection defenses.
- Audit logs for AI messages and tool calls.

## Non-Goals

- Autonomous destructive actions.
- Freeform SQL execution by AI.
- Arbitrary code execution.
- UI manifest generation; covered by Spec 04.

## Core Flow

1. User submits prompt.
2. System resolves workspace and permissions.
3. Intent is classified.
4. Tool candidates are selected from installed connectors and internal tools.
5. Inputs are validated.
6. Tools run server-side.
7. Outputs are redacted and normalized.
8. Assistant responds with evidence links and uncertainty notes.
9. Tool calls and answer metadata are audited.

## Tool Policy

AI tools must define:

- input schema.
- output schema.
- required permissions.
- risk level.
- source evidence fields.
- redaction policy.
- maximum result size.

Risk levels:

- `read`
- `sensitive_read`
- `low_write`
- `high_write`
- `destructive`

V1 AI operator can call only `read` and `sensitive_read` tools.

## Evidence Requirements

Every factual answer must include at least one:

- Metabase dashboard/card/source link.
- PostHog person/event/insight link.
- Sentry issue/event link.
- Stripe customer/subscription/invoice link.
- Support conversation link.
- Internal audit/tool-call ID.

If evidence is missing, assistant must say so clearly.

## Redaction Requirements

Redact before model context:

- secrets/tokens/API keys.
- payment card details.
- raw OAuth credentials.
- excessive message/email content.
- sensitive support content unless user has permission.
- PII fields not needed for the answer.

## Prompt-Injection Defenses

External text from tickets, logs, emails, errors, and dashboards is untrusted. The assistant must treat it as data, not instructions.

## UI Requirements

- `/ask` streaming chat interface.
- Source/evidence panel per answer.
- Tool-call timeline for each answer.
- Clear warning when answer is partial.
- “Use this as dashboard” handoff to Spec 04 once available.

## Acceptance Criteria

- AI can answer a cross-tool read-only question with cited sources.
- AI refuses unauthorized requests.
- AI identifies partial/missing source data.
- AI does not expose connector secrets.
- Tool calls are auditable.
- Untrusted source text cannot override system/tool policy.

## Verification

- Unit tests for tool policy enforcement.
- Unit tests for redaction.
- Prompt-injection regression fixtures.
- Integration test: ask revenue + incident question and verify cited source links.
- Integration test: unauthorized support user cannot query revenue-sensitive data.
