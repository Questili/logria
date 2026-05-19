import type { Capability, Role } from "./types";

const allCapabilities: Capability[] = [
  "workspace.manage",
  "connector.manage",
  "connector.view_health",
  "account.view_basic",
  "account.view_sensitive",
  "revenue.view",
  "support.view",
  "incident.view",
  "product_analytics.view",
  "audit.view",
  "dashboard.manage_personal",
  "dashboard.manage_team",
  "plugin.manage",
  "action.run_low_risk",
  "action.approve_high_risk",
];

export const roleCapabilities: Record<Role, Capability[]> = {
  owner: allCapabilities,
  admin: allCapabilities.filter((capability) => capability !== "action.approve_high_risk"),
  support: ["account.view_basic", "support.view", "incident.view", "audit.view", "dashboard.manage_personal"],
  engineering: ["account.view_basic", "account.view_sensitive", "incident.view", "product_analytics.view", "connector.view_health", "audit.view", "dashboard.manage_personal", "action.run_low_risk"],
  revenue: ["account.view_basic", "account.view_sensitive", "revenue.view", "support.view", "audit.view", "dashboard.manage_personal", "action.run_low_risk"],
  auditor: ["account.view_basic", "connector.view_health", "audit.view"],
};

export function capabilitiesForRole(role: Role): Set<Capability> {
  return new Set(roleCapabilities[role]);
}

export function hasCapability(role: Role, capability: Capability): boolean {
  return capabilitiesForRole(role).has(capability);
}

export function assertCapability(role: Role, capability: Capability): void {
  if (!hasCapability(role, capability)) {
    throw new Error(`Missing required capability: ${capability}`);
  }
}
