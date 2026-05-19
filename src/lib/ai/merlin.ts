import { createHash } from "node:crypto";
import { emitAuditEvent } from "../audit";
import { persistAIExchange } from "../persistence";
import { demoUser, demoWorkspace } from "../demo-data";
import { hasCapability } from "../permissions";
import type { Capability, Evidence, RiskLevel } from "../types";
import { getAllTools } from "../connectors/registry";
import { redactObject, sanitizeExternalText } from "./redaction";
import { answerWithOpenAIResponses } from "./provider";

type ToolWithConnector = ReturnType<typeof getAllTools>[number];

export type MerlinAnswer = {
  answer: string;
  evidence: Evidence[];
  toolCalls: { toolId: string; riskLevel: RiskLevel; outputSummary: string }[];
  partial: boolean;
  refused?: boolean;
};

function inputHash(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16);
}

function classify(prompt: string): string[] {
  const normalized = prompt.toLowerCase();
  const wanted = new Set<string>();
  if (/revenue|mrr|arr|billing|payment|renewal|stripe/.test(normalized)) wanted.add("stripe.revenue_movements");
  if (/incident|sentry|error|issue|affected|outage/.test(normalized)) wanted.add("sentry.list_unresolved_issues");
  if (/support|ticket|conversation|customer pain/.test(normalized)) wanted.add("support.search_conversations");
  if (/product|activation|usage|posthog|adoption/.test(normalized)) wanted.add("posthog.fetch_recent_events");
  if (/dashboard|health|changed|summary|what/.test(normalized)) wanted.add("metabase.fetch_card_result");
  return wanted.size ? [...wanted] : ["metabase.fetch_card_result", "sentry.list_unresolved_issues", "stripe.revenue_movements"];
}

function canRunTool(tool: ToolWithConnector, role = demoUser.role): boolean {
  return tool.requiredPermissions.every((permission: Capability) => hasCapability(role, permission));
}

export async function answerMerlin(prompt: string): Promise<MerlinAnswer> {
  const cleanedPrompt = sanitizeExternalText(prompt).slice(0, 2000);
  if (process.env.LOGRIA_AI_MODE === "openai") {
    const providerAnswer = await answerWithOpenAIResponses(cleanedPrompt);
    await persistAIExchange({ prompt: cleanedPrompt, answer: providerAnswer.answer, toolCalls: providerAnswer.toolCalls.map((call) => ({ toolId: call.toolId, inputHash: call.inputHash ?? inputHash(cleanedPrompt), outputSummary: call.outputSummary, riskLevel: call.riskLevel })) }).catch(() => undefined);
    return providerAnswer;
  }
  if (/secret|api key|token|credential|password/i.test(cleanedPrompt)) {
    emitAuditEvent({ workspaceId: demoWorkspace.id, actorUserId: demoUser.id, eventType: "ai.refused", riskLevel: "sensitive_read", targetType: "ai_prompt", reason: "Secret extraction request refused", metadata: { prompt: cleanedPrompt } });
    return { answer: "I can’t reveal secrets, tokens, raw credentials, or hidden connector configuration. I can help review connector health or audit history instead.", evidence: [], toolCalls: [], partial: false, refused: true };
  }

  const tools = getAllTools().filter((tool) => classify(cleanedPrompt).includes(tool.toolId));
  const evidence: Evidence[] = [];
  const summaries: string[] = [];
  const toolCalls: MerlinAnswer["toolCalls"] = [];
  let partial = false;

  for (const tool of tools) {
    if (!canRunTool(tool)) {
      partial = true;
      continue;
    }
    const result = await tool.run({ query: cleanedPrompt });
    const redacted = redactObject(result.data);
    evidence.push(...result.evidence);
    summaries.push(`${tool.connectorName}: ${JSON.stringify(redacted).slice(0, 280)}`);
    toolCalls.push({ toolId: tool.toolId, riskLevel: tool.riskLevel, outputSummary: JSON.stringify(redacted).slice(0, 180) });
    emitAuditEvent({
      workspaceId: demoWorkspace.id,
      actorUserId: demoUser.id,
      eventType: "ai.tool_call",
      riskLevel: tool.riskLevel,
      targetType: "tool",
      targetId: tool.toolId,
      reason: "Merlin read-only demo answer",
      metadata: { inputHash: inputHash(cleanedPrompt), evidenceCount: result.evidence.length },
    });
  }

  if (!evidence.length) {
    return { answer: "I could not produce an evidence-backed answer from the tools available to your role.", evidence: [], toolCalls, partial: true };
  }

  const answer = [
    "Here’s the evidence-backed operational readout:",
    ...summaries.map((summary) => `• ${summary}`),
    partial ? "Some sources were unavailable or unauthorized, so this answer is partial." : "All selected demo sources returned evidence.",
  ].join("\n");
  await persistAIExchange({ prompt: cleanedPrompt, answer, toolCalls: toolCalls.map((call) => ({ ...call, inputHash: inputHash(cleanedPrompt) })) }).catch(() => undefined);
  return { answer, evidence, toolCalls, partial };
}
