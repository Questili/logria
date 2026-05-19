export const roles = ["owner", "admin", "support", "engineering", "revenue", "auditor"] as const;
export type Role = (typeof roles)[number];

export const capabilities = [
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
] as const;
export type Capability = (typeof capabilities)[number];

export const riskLevels = ["read", "sensitive_read", "low_write", "high_write", "destructive"] as const;
export type RiskLevel = (typeof riskLevels)[number];

export type Evidence = {
  sourceType: string;
  label: string;
  url: string;
  objectId: string;
  confidence: number;
  observedAt: string;
};

export type ToolResult<T = unknown> = {
  data: T;
  evidence: Evidence[];
  freshness: string;
  partial?: boolean;
  warnings?: string[];
};

export type DemoAccount = {
  id: string;
  name: string;
  domain: string;
  plan: "Free" | "Growth" | "Business" | "Enterprise";
  mrr: number;
  health: "healthy" | "watch" | "at_risk";
  activation: number;
  supportOpen: number;
  incidents: string[];
  failedPayments: number;
};
