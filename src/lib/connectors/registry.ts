import { z } from "zod";
import { demoAccounts, incidents, productSignals, revenueMovements, supportConversations } from "../demo-data";
import type { ConnectorDefinition } from "./contract";
import { sourceEvidence } from "./contract";

const emptyConfig = z.record(z.string(), z.unknown()).default({});
const apiSecret = z.object({ apiKey: z.string().min(1).optional(), baseUrl: z.string().url().optional() });
const anyInput = z.record(z.string(), z.unknown()).default({});

function healthy() {
  return Promise.resolve({ status: "demo" as const, latencyMs: 42, lastSuccessAt: new Date().toISOString() });
}

export const connectors: ConnectorDefinition[] = [
  {
    id: "metabase",
    name: "Metabase",
    category: "bi",
    version: "0.1.0",
    configSchema: emptyConfig,
    secretSchema: apiSecret,
    redactionPolicy: ["apiKey", "sessionToken"],
    buildSourceLink: (id) => `https://metabase.example/question/${id}`,
    healthCheck: healthy,
    tools: [
      {
        toolId: "metabase.fetch_card_result",
        description: "Fetch a demo BI card result for company health.",
        inputSchema: anyInput,
        outputSchema: z.object({ cards: z.array(z.object({ title: z.string(), value: z.union([z.string(), z.number()]) })) }),
        requiredPermissions: ["product_analytics.view"],
        riskLevel: "read",
        sourceLinkFields: ["cardId"],
        cachePolicy: "short",
        run: async () => ({
          data: { cards: [{ title: "Activated accounts", value: 72 }, { title: "Open incidents", value: incidents.length }] },
          evidence: sourceEvidence("metabase", "Company health card", "https://metabase.example/question/company-health", "company-health"),
          freshness: new Date().toISOString(),
        }),
      },
    ],
  },
  {
    id: "posthog",
    name: "PostHog",
    category: "product_analytics",
    version: "0.1.0",
    configSchema: emptyConfig,
    secretSchema: apiSecret,
    redactionPolicy: ["apiKey", "personalApiKey"],
    buildSourceLink: (id) => `https://app.posthog.com/project/demo/${id}`,
    healthCheck: healthy,
    tools: [
      {
        toolId: "posthog.fetch_recent_events",
        description: "Fetch recent demo product analytics events.",
        inputSchema: anyInput,
        outputSchema: z.object({ events: z.array(z.object({ account: z.string(), event: z.string(), count: z.number(), url: z.string() })) }),
        requiredPermissions: ["product_analytics.view"],
        riskLevel: "read",
        sourceLinkFields: ["id"],
        cachePolicy: "short",
        run: async () => ({ data: { events: productSignals }, evidence: sourceEvidence("posthog", "Activation insight", productSignals[1].url, "activation"), freshness: new Date().toISOString() }),
      },
    ],
  },
  {
    id: "sentry",
    name: "Sentry",
    category: "observability",
    version: "0.1.0",
    configSchema: emptyConfig,
    secretSchema: apiSecret,
    redactionPolicy: ["authToken"],
    buildSourceLink: (id) => `https://sentry.io/organizations/demo/issues/${id}/`,
    healthCheck: healthy,
    tools: [
      {
        toolId: "sentry.list_unresolved_issues",
        description: "List unresolved demo Sentry issues with impacted accounts.",
        inputSchema: anyInput,
        outputSchema: z.object({ issues: z.array(z.object({ id: z.string(), title: z.string(), severity: z.string(), affectedAccounts: z.array(z.string()), url: z.string() })) }),
        requiredPermissions: ["incident.view"],
        riskLevel: "read",
        sourceLinkFields: ["issueId"],
        cachePolicy: "short",
        run: async () => ({ data: { issues: incidents }, evidence: sourceEvidence("sentry", "Unresolved issues", incidents[0].url, incidents[0].id), freshness: new Date().toISOString() }),
      },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "billing",
    version: "0.1.0",
    configSchema: emptyConfig,
    secretSchema: apiSecret,
    redactionPolicy: ["secretKey", "webhookSecret"],
    buildSourceLink: (id) => `https://dashboard.stripe.com/test/customers/${id}`,
    healthCheck: healthy,
    tools: [
      {
        toolId: "stripe.revenue_movements",
        description: "Summarize demo revenue movements and failed renewals.",
        inputSchema: anyInput,
        outputSchema: z.object({ movements: z.array(z.object({ label: z.string(), amount: z.number(), accounts: z.array(z.string()), url: z.string() })) }),
        requiredPermissions: ["revenue.view"],
        riskLevel: "sensitive_read",
        sourceLinkFields: ["customerId"],
        cachePolicy: "short",
        run: async () => ({ data: { movements: revenueMovements }, evidence: sourceEvidence("stripe", "Revenue movements", revenueMovements[0].url, "revenue-movements"), freshness: new Date().toISOString() }),
      },
    ],
  },
  {
    id: "support",
    name: "Chatwoot/Crisp support",
    category: "support",
    version: "0.1.0",
    configSchema: emptyConfig,
    secretSchema: apiSecret,
    redactionPolicy: ["apiToken", "websiteToken"],
    buildSourceLink: (id) => `https://app.chatwoot.com/app/accounts/demo/conversations/${id}`,
    healthCheck: healthy,
    tools: [
      {
        toolId: "support.search_conversations",
        description: "Search demo support conversations by account or domain.",
        inputSchema: z.object({ query: z.string().optional() }).default({}),
        outputSchema: z.object({ conversations: z.array(z.object({ account: z.string(), subject: z.string(), status: z.string(), url: z.string() })) }),
        requiredPermissions: ["support.view"],
        riskLevel: "sensitive_read",
        sourceLinkFields: ["conversationId"],
        cachePolicy: "short",
        run: async () => ({ data: { conversations: supportConversations }, evidence: sourceEvidence("support", "Open support conversations", supportConversations[0].url, supportConversations[0].id), freshness: new Date().toISOString() }),
      },
    ],
  },
];

export function getConnector(connectorId: string): ConnectorDefinition | undefined {
  return connectors.find((connector) => connector.id === connectorId);
}

export function getAllTools() {
  return connectors.flatMap((connector) => connector.tools.map((tool) => ({ ...tool, connectorId: connector.id, connectorName: connector.name })));
}

export const connectorInstallations = connectors.map((connector) => ({
  id: `install_${connector.id}`,
  connectorId: connector.id,
  displayName: connector.name,
  status: "demo" as const,
  category: connector.category,
  secretsRequired: Object.keys((connector.secretSchema as z.ZodObject<z.ZodRawShape>).shape ?? {}),
}));

export { demoAccounts };
