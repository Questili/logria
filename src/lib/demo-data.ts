import type { DemoAccount } from "./types";

export const demoWorkspace = { id: "ws_demo", slug: "demo", name: "Demo SaaS Co" };
export const demoUser = { id: "user_demo_owner", email: "operator@logria.dev", name: "Demo Operator", role: "owner" as const };

export const demoAccounts: DemoAccount[] = [
  { id: "acct_northstar", name: "Northstar Labs", domain: "northstar.example", plan: "Enterprise", mrr: 4200, health: "at_risk", activation: 82, supportOpen: 3, incidents: ["sentry-117"], failedPayments: 1 },
  { id: "acct_riverline", name: "Riverline Health", domain: "riverline.example", plan: "Business", mrr: 1600, health: "watch", activation: 67, supportOpen: 1, incidents: ["sentry-204"], failedPayments: 0 },
  { id: "acct_stellar", name: "Stellar Forms", domain: "stellar.example", plan: "Growth", mrr: 480, health: "healthy", activation: 91, supportOpen: 0, incidents: [], failedPayments: 0 },
];

export const revenueMovements = [
  { id: "rev_1", label: "Failed renewals", amount: -1280, accounts: ["Northstar Labs"], url: "https://dashboard.stripe.com/test/payments" },
  { id: "rev_2", label: "New business", amount: 2080, accounts: ["Stellar Forms", "Riverline Health"], url: "https://dashboard.stripe.com/test/subscriptions" },
  { id: "rev_3", label: "Expansion", amount: 740, accounts: ["Northstar Labs"], url: "https://dashboard.stripe.com/test/customers" },
];

export const productSignals = [
  { id: "ph_1", account: "Northstar Labs", event: "Flowboard created", count: 18, url: "https://app.posthog.com/project/demo/person/northstar" },
  { id: "ph_2", account: "Riverline Health", event: "Assistant answer cited", count: 44, url: "https://app.posthog.com/project/demo/insights/activation" },
  { id: "ph_3", account: "Stellar Forms", event: "Dashboard customized", count: 9, url: "https://app.posthog.com/project/demo/insights/customization" },
];

export const incidents = [
  { id: "sentry-117", title: "Microsoft Graph sync timeout", severity: "high", affectedAccounts: ["Northstar Labs"], url: "https://sentry.io/organizations/demo/issues/sentry-117/" },
  { id: "sentry-204", title: "Webhook retry exceeded", severity: "medium", affectedAccounts: ["Riverline Health"], url: "https://sentry.io/organizations/demo/issues/sentry-204/" },
];

export const supportConversations = [
  { id: "sup_1", account: "Northstar Labs", subject: "Mailbox sync is delayed", status: "open", url: "https://app.chatwoot.com/app/accounts/demo/conversations/1" },
  { id: "sup_2", account: "Northstar Labs", subject: "Billing renewal failed", status: "open", url: "https://app.chatwoot.com/app/accounts/demo/conversations/2" },
  { id: "sup_3", account: "Riverline Health", subject: "Webhook retry alert", status: "pending", url: "https://app.chatwoot.com/app/accounts/demo/conversations/3" },
];
