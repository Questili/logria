import { z } from "zod";
import { capabilities } from "../types";

export const widgetManifestSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["metric", "table", "timeline", "evidence", "plugin"]),
  title: z.string().min(1),
  description: z.string().optional(),
  binding: z.object({ connectorId: z.string(), toolId: z.string(), params: z.record(z.string(), z.unknown()).default({}) }),
  display: z.record(z.string(), z.unknown()).default({}),
  emptyState: z.string().default("No data yet."),
  errorState: z.string().default("This widget could not load."),
  requiredPermissions: z.array(z.enum(capabilities)),
});

export const dashboardManifestSchema = z.object({
  schemaVersion: z.literal("1.0"),
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  scope: z.enum(["personal", "team", "global"]),
  layout: z.object({ columns: z.number().int().min(1).max(12), sections: z.array(z.object({ id: z.string(), widgetIds: z.array(z.string()) })) }),
  widgets: z.array(widgetManifestSchema).min(1),
  filters: z.array(z.object({ id: z.string(), label: z.string(), type: z.string() })).default([]),
  requiredPermissions: z.array(z.enum(capabilities)),
  freshnessPolicy: z.object({ maxAgeSeconds: z.number().int().positive() }),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type DashboardManifest = z.infer<typeof dashboardManifestSchema>;
export type WidgetManifest = z.infer<typeof widgetManifestSchema>;
