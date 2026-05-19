import { z } from "zod";
import { emitAuditEvent } from "../audit";
import { demoUser, demoWorkspace } from "../demo-data";
import { hasCapability } from "../permissions";
import type { Capability, RiskLevel } from "../types";

type WriteRisk = Extract<RiskLevel, "low_write" | "high_write" | "destructive">;
type ActionResult = { status: "preview" | "executed" | "approval_required"; message: string; idempotencyKey: string; rollbackNotes: string };
type ActionDefinition<I> = {
  actionId: string;
  description: string;
  inputSchema: z.ZodType<I>;
  requiredPermissions: Capability[];
  riskLevel: WriteRisk;
  dryRun: (input: I) => Promise<ActionResult>;
  execute: (input: I, reason: string, idempotencyKey: string) => Promise<ActionResult>;
};

const actionRuns = new Map<string, ActionResult>();
const lowRiskInput = z.object({ accountId: z.string(), note: z.string().min(3) });

type LowRiskInput = z.infer<typeof lowRiskInput>;

export const actions: ActionDefinition<LowRiskInput>[] = [
  {
    actionId: "ops.mark_follow_up_needed",
    description: "Create an internal follow-up marker for an account.",
    inputSchema: lowRiskInput,
    requiredPermissions: ["action.run_low_risk"],
    riskLevel: "low_write",
    dryRun: async (input) => ({ status: "preview", message: `Would mark ${input.accountId} for follow-up: ${input.note}`, idempotencyKey: `${input.accountId}:${input.note}`, rollbackNotes: "Remove the internal follow-up marker." }),
    execute: async (input, reason, idempotencyKey) => ({ status: "executed", message: `Marked ${input.accountId} for follow-up (${reason}).`, idempotencyKey, rollbackNotes: "Remove the internal follow-up marker." }),
  },
];

export function getAction(actionId: string) {
  return actions.find((action) => action.actionId === actionId);
}

export async function previewAction(actionId: string, input: unknown): Promise<ActionResult> {
  const action = getAction(actionId);
  if (!action) throw new Error("Unknown action");
  if (!action.requiredPermissions.every((capability) => hasCapability(demoUser.role, capability))) throw new Error("Unauthorized action preview");
  const parsed = action.inputSchema.parse(input);
  if (action.riskLevel === "high_write" || action.riskLevel === "destructive") {
    return { status: "approval_required", message: "High-risk action requires approval and is not executed in demo mode.", idempotencyKey: "approval-required", rollbackNotes: "No side effect occurred." };
  }
  return action.dryRun(parsed);
}

export async function executeAction(actionId: string, input: unknown, reason: string): Promise<ActionResult> {
  const action = getAction(actionId);
  if (!action) throw new Error("Unknown action");
  if (!reason.trim()) throw new Error("Action reason is required");
  const preview = await previewAction(actionId, input);
  if (preview.status === "approval_required") return preview;
  if (actionRuns.has(preview.idempotencyKey)) return actionRuns.get(preview.idempotencyKey)!;
  const parsed = action.inputSchema.parse(input);
  const result = await action.execute(parsed, reason, preview.idempotencyKey);
  actionRuns.set(preview.idempotencyKey, result);
  emitAuditEvent({ workspaceId: demoWorkspace.id, actorUserId: demoUser.id, eventType: "ops.action_run", riskLevel: action.riskLevel, targetType: "account", targetId: parsed.accountId, reason, metadata: { actionId, idempotencyKey: result.idempotencyKey } });
  return result;
}

export function resetActionRunsForTests(): void {
  actionRuns.clear();
}
