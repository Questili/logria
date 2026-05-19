import { z } from "zod";
import { connectorInstallations, getAllTools } from "../connectors/registry";
import { hasCapability } from "../permissions";
import type { Role } from "../types";
import { dashboardManifestSchema, type DashboardManifest } from "./schema";

export type ManifestValidation = { ok: true; manifest: DashboardManifest } | { ok: false; errors: string[] };

export function validateDashboardManifest(input: unknown, role: Role): ManifestValidation {
  const parsed = dashboardManifestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.treeifyError(parsed.error).errors };
  }
  const manifest = parsed.data;
  const widgetIds = new Set(manifest.widgets.map((widget) => widget.id));
  const layoutErrors = manifest.layout.sections.flatMap((section) => section.widgetIds.filter((id) => !widgetIds.has(id)).map((id) => `Unknown widget in layout: ${id}`));
  const permissionErrors = [...manifest.requiredPermissions, ...manifest.widgets.flatMap((widget) => widget.requiredPermissions)]
    .filter((permission) => !hasCapability(role, permission))
    .map((permission) => `Missing permission: ${permission}`);
  const installed = new Set(connectorInstallations.map((connector) => connector.connectorId));
  const tools = new Set(getAllTools().map((tool) => tool.toolId));
  const bindingErrors = manifest.widgets.flatMap((widget) => {
    const errors: string[] = [];
    if (!installed.has(widget.binding.connectorId)) errors.push(`Connector not installed: ${widget.binding.connectorId}`);
    if (!tools.has(widget.binding.toolId)) errors.push(`Tool not available: ${widget.binding.toolId}`);
    return errors;
  });
  const errors = [...layoutErrors, ...permissionErrors, ...bindingErrors];
  return errors.length ? { ok: false, errors } : { ok: true, manifest };
}

export const defaultDashboard: DashboardManifest = {
  schemaVersion: "1.0",
  id: "daily-ops-review",
  title: "Daily ops review",
  description: "Revenue, product, support, incidents, and evidence in one demo dashboard.",
  scope: "personal",
  layout: { columns: 12, sections: [{ id: "top", widgetIds: ["revenue", "incidents", "support", "product"] }] },
  widgets: [
    { id: "revenue", type: "metric", title: "Revenue movement", binding: { connectorId: "stripe", toolId: "stripe.revenue_movements", params: {} }, display: { tone: "money" }, emptyState: "No revenue movement.", errorState: "Revenue connector failed.", requiredPermissions: ["revenue.view"] },
    { id: "incidents", type: "table", title: "Active incidents", binding: { connectorId: "sentry", toolId: "sentry.list_unresolved_issues", params: {} }, display: { columns: ["title", "severity"] }, emptyState: "No incidents.", errorState: "Incident connector failed.", requiredPermissions: ["incident.view"] },
    { id: "support", type: "timeline", title: "Support pressure", binding: { connectorId: "support", toolId: "support.search_conversations", params: {} }, display: {}, emptyState: "No support conversations.", errorState: "Support connector failed.", requiredPermissions: ["support.view"] },
    { id: "product", type: "metric", title: "Activation signals", binding: { connectorId: "posthog", toolId: "posthog.fetch_recent_events", params: {} }, display: {}, emptyState: "No product events.", errorState: "Product analytics connector failed.", requiredPermissions: ["product_analytics.view"] },
  ],
  filters: [{ id: "range", label: "Date range", type: "date-range" }],
  requiredPermissions: ["dashboard.manage_personal"],
  freshnessPolicy: { maxAgeSeconds: 300 },
  createdBy: "user_demo_owner",
  updatedBy: "user_demo_owner",
  createdAt: new Date("2026-05-19T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-05-19T00:00:00.000Z").toISOString(),
};

export function generateManifestPatch(prompt: string): Partial<DashboardManifest> {
  const wantsIncidentsFirst = /incident|error|sentry/i.test(prompt);
  return {
    updatedAt: new Date().toISOString(),
    layout: wantsIncidentsFirst
      ? { columns: 12, sections: [{ id: "top", widgetIds: ["incidents", "support", "revenue", "product"] }] }
      : { columns: 12, sections: [{ id: "top", widgetIds: ["revenue", "product", "support", "incidents"] }] },
  };
}
