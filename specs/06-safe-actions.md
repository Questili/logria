# Spec 06: Safe Actions

## Purpose

Allow authorized operators to perform low-risk and eventually high-risk operational actions safely, with dry-run previews, confirmations, approvals, idempotency, and audit trails.

## Scope

- Action registry.
- Risk model.
- Dry-run/preview flow.
- Confirmation and reason capture.
- Approval workflow.
- Idempotency and result tracking.
- Audit logging.

## Non-Goals

- Destructive actions enabled by default.
- AI autonomous writes without human confirmation.
- Bypassing source-of-truth systems.

## Action Contract

Each action defines:

- `actionId`.
- description.
- input schema.
- target resolver.
- required permissions.
- risk level.
- dry-run function.
- execute function.
- idempotency key strategy.
- audit metadata.
- rollback guidance.

Risk levels:

- `low_write`: internal note/follow-up, refresh cached status.
- `high_write`: billing credit, entitlement update, retry external side effect.
- `destructive`: delete, disable, revoke, refund, irreversible state change.

V1 enables only selected `low_write` actions.

## Required Flow

1. Operator selects or requests action.
2. System validates permission.
3. System resolves target object.
4. System runs dry-run/preview.
5. Operator confirms and enters reason.
6. If high-risk, approval request is created.
7. Execute with idempotency key.
8. Persist result and audit event.
9. Show source/result link and rollback guidance.

## Data Model

Required models:

- `OpsActionDefinition` or static registry.
- `OpsActionRun`.
- `ApprovalRequest`.
- `ApprovalDecision`.
- `AuditEvent` integration.

## AI Interaction

AI may propose actions, but cannot execute without the same preview/confirmation/approval flow. AI-generated action inputs must be validated and displayed to the operator.

## Acceptance Criteria

- Low-risk action executes only after confirmation.
- High-risk action creates approval request and does not execute immediately.
- Unauthorized user cannot preview or execute action.
- Every action run records reason, actor, target, idempotency key, result, and audit event.
- Retrying same idempotency key does not duplicate side effects.

## Verification

- Unit tests for action policy and risk gates.
- Unit tests for idempotency.
- Integration test for low-risk action success/failure.
- Integration test for high-risk approval path.
- E2E test: AI proposes action, user previews, confirms, audit appears.
