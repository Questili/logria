import { z } from "zod";
import type { Capability, RiskLevel } from "../types";

export const pluginManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  version: z.string().min(1),
  publisher: z.string().min(1),
  license: z.string().min(1),
  homepage: z.string().url().optional(),
  repository: z.string().url().optional(),
  compatibility: z.object({ logria: z.string().min(1) }),
  requestedPermissions: z.array(z.string()),
  requestedSecrets: z.array(z.string()).default([]),
  networkDomains: z.array(z.string()).default([]),
  dataCategories: z.array(z.string()).default([]),
  contributes: z.object({ connectors: z.array(z.string()).default([]), tools: z.array(z.string()).default([]), widgets: z.array(z.string()).default([]), actions: z.array(z.string()).default([]) }),
  riskLevels: z.array(z.enum(["read", "sensitive_read", "low_write", "high_write", "destructive"])),
  auditEvents: z.array(z.string()).default([]),
  demoFixtures: z.boolean().default(false),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

export function defineConnector<T>(definition: T): T { return definition; }
export function defineTool<T>(definition: T & { requiredPermissions: Capability[]; riskLevel: RiskLevel }): T { return definition; }
export function defineWidget<T>(definition: T): T { return definition; }
export function defineAction<T>(definition: T & { riskLevel: Exclude<RiskLevel, "read" | "sensitive_read"> }): T { return definition; }
export function defineRedactionPolicy<T>(definition: T): T { return definition; }
export function defineExport<T>(definition: T): T { return definition; }
