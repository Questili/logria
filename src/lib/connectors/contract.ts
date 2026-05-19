import { z } from "zod";
import type { Capability, RiskLevel, ToolResult } from "../types";

export const connectorCategories = ["bi", "product_analytics", "observability", "billing", "support", "ops", "compliance"] as const;
export type ConnectorCategory = (typeof connectorCategories)[number];
export type ConnectorStatus = "demo" | "healthy" | "degraded" | "failing" | "disabled";

export type ConnectorHealth = {
  status: ConnectorStatus;
  latencyMs: number;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  errorSummary?: string;
};

export type ConnectorTool<I = unknown, O = unknown> = {
  toolId: string;
  description: string;
  inputSchema: z.ZodType<I>;
  outputSchema: z.ZodType<O>;
  requiredPermissions: Capability[];
  riskLevel: RiskLevel;
  sourceLinkFields: string[];
  cachePolicy: "no-store" | "short" | "hourly";
  run: (input: I) => Promise<ToolResult<O>>;
};

export type ConnectorDefinition = {
  id: string;
  name: string;
  category: ConnectorCategory;
  version: string;
  configSchema: z.ZodType<Record<string, unknown>>;
  secretSchema: z.ZodType<Record<string, unknown>>;
  redactionPolicy: string[];
  buildSourceLink: (objectId: string) => string;
  healthCheck: () => Promise<ConnectorHealth>;
  tools: ConnectorTool[];
};

export function sourceEvidence(sourceType: string, label: string, url: string, objectId: string) {
  return [{ sourceType, label, url, objectId, confidence: 0.92, observedAt: new Date().toISOString() }];
}
