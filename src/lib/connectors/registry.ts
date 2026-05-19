import { z } from "zod";
import { demoAccounts, incidents, productSignals, revenueMovements, supportConversations } from "../demo-data";
import { createChatwootClient, createMetabaseClient, createPostHogClient, createSentryClient, createStripeClient } from "./real-clients";
import type { ConnectorDefinition } from "./contract";
import { sourceEvidence } from "./contract";

const emptyConfig = z.record(z.string(), z.unknown()).default({});
const apiSecret = z.object({ apiKey: z.string().min(1).optional(), baseUrl: z.string().url().optional() });
const anyInput = z.record(z.string(), z.unknown()).default({});

function realMetabase() {
  return process.env.METABASE_BASE_URL && process.env.METABASE_API_KEY
    ? createMetabaseClient({ baseUrl: process.env.METABASE_BASE_URL, apiKey: process.env.METABASE_API_KEY })
    : null;
}
function realPostHog() {
  return process.env.POSTHOG_BASE_URL && process.env.POSTHOG_PERSONAL_API_KEY && process.env.POSTHOG_PROJECT_ID
    ? createPostHogClient({ baseUrl: process.env.POSTHOG_BASE_URL, personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY, projectId: process.env.POSTHOG_PROJECT_ID })
    : null;
}
function realSentry() {
  return process.env.SENTRY_BASE_URL && process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG
    ? createSentryClient({ baseUrl: process.env.SENTRY_BASE_URL, authToken: process.env.SENTRY_AUTH_TOKEN, organizationSlug: process.env.SENTRY_ORG, projectSlug: process.env.SENTRY_PROJECT })
    : null;
}
function realStripe() {
  return process.env.STRIPE_SECRET_KEY
    ? createStripeClient({ secretKey: process.env.STRIPE_SECRET_KEY, baseUrl: process.env.STRIPE_BASE_URL })
    : null;
}
function realChatwoot() {
  return process.env.CHATWOOT_BASE_URL && process.env.CHATWOOT_API_ACCESS_TOKEN && process.env.CHATWOOT_ACCOUNT_ID
    ? createChatwootClient({ baseUrl: process.env.CHATWOOT_BASE_URL, apiAccessToken: process.env.CHATWOOT_API_ACCESS_TOKEN, accountId: process.env.CHATWOOT_ACCOUNT_ID })
    : null;
}

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
        run: async () => {
          const real = realMetabase();
          if (real) {
            const cards = await real.listCards();
            return { data: { cards: cards.slice(0, 10).map((card) => ({ title: String(card.name ?? card.title ?? card.id ?? "Metabase card"), value: String(card.display ?? card.id ?? "ready") })) }, evidence: sourceEvidence("metabase", "Metabase cards", real.sourceLink("browse/models"), "cards"), freshness: new Date().toISOString() };
          }
          return { data: { cards: [{ title: "Activated accounts", value: 72 }, { title: "Open incidents", value: incidents.length }] }, evidence: sourceEvidence("metabase", "Company health card", "https://metabase.example/question/company-health", "company-health"), freshness: new Date().toISOString() };
        },
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
        run: async () => {
          const real = realPostHog();
          if (real) {
            const events = await real.fetchRecentEvents(25);
            return { data: { events: [{ account: "PostHog", event: "HogQL recent events", count: Array.isArray(events.results) ? events.results.length : 1, url: real.sourceLink("events") }] }, evidence: sourceEvidence("posthog", "Recent events query", real.sourceLink("events"), "events"), freshness: new Date().toISOString() };
          }
          return { data: { events: productSignals }, evidence: sourceEvidence("posthog", "Activation insight", productSignals[1].url, "activation"), freshness: new Date().toISOString() };
        },
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
        run: async () => {
          const real = realSentry();
          if (real) {
            const issues = await real.listUnresolvedIssues();
            return { data: { issues: issues.slice(0, 25).map((issue) => ({ id: String(issue.id ?? issue.shortId ?? issue.issueId), title: String(issue.title ?? issue.culprit ?? "Sentry issue"), severity: String(issue.level ?? issue.priority ?? "unknown"), affectedAccounts: [], url: String(issue.permalink ?? real.sourceLink(String(issue.id ?? issue.shortId))) })) }, evidence: sourceEvidence("sentry", "Unresolved issues", real.sourceLink(""), "issues"), freshness: new Date().toISOString() };
          }
          return { data: { issues: incidents }, evidence: sourceEvidence("sentry", "Unresolved issues", incidents[0].url, incidents[0].id), freshness: new Date().toISOString() };
        },
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
        run: async () => {
          const real = realStripe();
          if (real) {
            const invoices = await real.listPaymentFailures();
            return { data: { movements: invoices.slice(0, 25).map((invoice) => ({ label: String(invoice.status ?? "open invoice"), amount: -Math.round(Number(invoice.amount_remaining ?? 0) / 100), accounts: [String(invoice.customer ?? "unknown customer")], url: real.sourceLink(String(invoice.id ?? "invoices")) })) }, evidence: sourceEvidence("stripe", "Open invoices", "https://dashboard.stripe.com/invoices", "open-invoices"), freshness: new Date().toISOString() };
          }
          return { data: { movements: revenueMovements }, evidence: sourceEvidence("stripe", "Revenue movements", revenueMovements[0].url, "revenue-movements"), freshness: new Date().toISOString() };
        },
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
        run: async () => {
          const real = realChatwoot();
          if (real) {
            const conversations = await real.listConversations("open");
            return { data: { conversations: conversations.slice(0, 25).map((conversation) => ({ account: String(conversation.meta && typeof conversation.meta === "object" && "sender" in conversation.meta ? "Chatwoot contact" : conversation.account_id ?? "Chatwoot"), subject: String(conversation.subject ?? (typeof conversation.last_non_activity_message === "object" && conversation.last_non_activity_message && "content" in conversation.last_non_activity_message ? conversation.last_non_activity_message.content : undefined) ?? `Conversation ${conversation.id}`), status: String(conversation.status ?? "open"), url: real.sourceLink(String(conversation.id)) })) }, evidence: sourceEvidence("support", "Open Chatwoot conversations", real.sourceLink(""), "conversations"), freshness: new Date().toISOString() };
          }
          return { data: { conversations: supportConversations }, evidence: sourceEvidence("support", "Open support conversations", supportConversations[0].url, supportConversations[0].id), freshness: new Date().toISOString() };
        },
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
