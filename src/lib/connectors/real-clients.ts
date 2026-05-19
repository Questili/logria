import { z } from "zod";
import { fetchJson, normalizeBaseUrl, withQuery, type FetchLike } from "./http";

const unknownRecord = z.record(z.string(), z.unknown());
const listResponse = <T extends z.ZodTypeAny>(item: T) => z.union([z.array(item), z.object({ data: z.array(item) }), z.object({ results: z.array(item) }), z.object({ payload: z.array(item) })]);
function unwrapList<T>(value: T[] | { data?: T[]; results?: T[]; payload?: T[] }): T[] {
  return Array.isArray(value) ? value : value.data ?? value.results ?? value.payload ?? [];
}

export type MetabaseConfig = { baseUrl: string; apiKey: string };
export function createMetabaseClient(config: MetabaseConfig, fetcher: FetchLike = fetch) {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const headers = { "x-api-key": config.apiKey, accept: "application/json", "content-type": "application/json" };
  return {
    listDashboards: async () => unwrapList(await fetchJson(fetcher, `${baseUrl}/api/dashboard`, { headers }, listResponse(unknownRecord))),
    listCards: async () => unwrapList(await fetchJson(fetcher, `${baseUrl}/api/card`, { headers }, listResponse(unknownRecord))),
    fetchCardResult: async (cardId: string | number) => fetchJson(fetcher, `${baseUrl}/api/card/${cardId}/query/json`, { method: "POST", headers }, z.unknown()),
    sourceLink: (objectId: string | number) => `${baseUrl}/question/${objectId}`,
    health: async () => ({ ok: Boolean((await fetchJson(fetcher, `${baseUrl}/api/health`, { headers }, z.object({ status: z.string().optional() }).passthrough())).status ?? true) }),
  };
}

export type PostHogConfig = { baseUrl: string; personalApiKey: string; projectId: string };
export function createPostHogClient(config: PostHogConfig, fetcher: FetchLike = fetch) {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const headers = { authorization: `Bearer ${config.personalApiKey}`, accept: "application/json", "content-type": "application/json" };
  return {
    lookupPersons: async (search?: string) => unwrapList(await fetchJson(fetcher, withQuery(`${baseUrl}/api/projects/${config.projectId}/persons/`, { search, limit: 25 }), { headers }, listResponse(unknownRecord))),
    fetchRecentEvents: async (limit = 25) => fetchJson(fetcher, `${baseUrl}/api/projects/${config.projectId}/query/`, { method: "POST", headers, body: JSON.stringify({ query: { kind: "HogQLQuery", query: `select event, distinct_id, timestamp, properties from events order by timestamp desc limit ${Math.min(limit, 100)}` } }) }, unknownRecord),
    fetchInsightSummary: async (insightId: string | number) => fetchJson(fetcher, `${baseUrl}/api/projects/${config.projectId}/insights/${insightId}/`, { headers }, unknownRecord),
    sourceLink: (objectId: string | number) => `${baseUrl}/project/${config.projectId}/${objectId}`,
    health: async () => ({ ok: Boolean(await fetchJson(fetcher, `${baseUrl}/api/projects/${config.projectId}/`, { headers }, unknownRecord)) }),
  };
}

export type SentryConfig = { baseUrl: string; authToken: string; organizationSlug: string; projectSlug?: string };
export function createSentryClient(config: SentryConfig, fetcher: FetchLike = fetch) {
  const baseUrl = normalizeBaseUrl(config.baseUrl || "https://sentry.io");
  const headers = { authorization: `Bearer ${config.authToken}`, accept: "application/json" };
  const projectPath = config.projectSlug ? `/projects/${config.organizationSlug}/${config.projectSlug}` : `/organizations/${config.organizationSlug}`;
  return {
    listUnresolvedIssues: async () => unwrapList(await fetchJson(fetcher, withQuery(`${baseUrl}/api/0${projectPath}/issues/`, { query: "is:unresolved", limit: 25 }), { headers }, listResponse(unknownRecord))),
    fetchIssueDetails: async (issueId: string) => fetchJson(fetcher, `${baseUrl}/api/0/issues/${issueId}/`, { headers }, unknownRecord),
    fetchIssueEvents: async (issueId: string) => unwrapList(await fetchJson(fetcher, `${baseUrl}/api/0/issues/${issueId}/events/`, { headers }, listResponse(unknownRecord))),
    sourceLink: (issueId: string) => `${baseUrl}/organizations/${config.organizationSlug}/issues/${issueId}/`,
    health: async () => ({ ok: Boolean(await fetchJson(fetcher, `${baseUrl}/api/0/organizations/${config.organizationSlug}/`, { headers }, unknownRecord)) }),
  };
}

export type StripeConfig = { secretKey: string; baseUrl?: string };
export function createStripeClient(config: StripeConfig, fetcher: FetchLike = fetch) {
  const baseUrl = normalizeBaseUrl(config.baseUrl ?? "https://api.stripe.com");
  const headers = { authorization: `Bearer ${config.secretKey}`, accept: "application/json" };
  return {
    lookupCustomers: async (query: string) => unwrapList(await fetchJson(fetcher, withQuery(`${baseUrl}/v1/customers/search`, { query, limit: 10 }), { headers }, z.object({ data: z.array(unknownRecord) }))),
    fetchSubscription: async (subscriptionId: string) => fetchJson(fetcher, `${baseUrl}/v1/subscriptions/${subscriptionId}`, { headers }, unknownRecord),
    listInvoices: async (customer?: string) => unwrapList(await fetchJson(fetcher, withQuery(`${baseUrl}/v1/invoices`, { customer, limit: 25 }), { headers }, z.object({ data: z.array(unknownRecord) }))),
    listPaymentFailures: async (customer?: string) => unwrapList(await fetchJson(fetcher, withQuery(`${baseUrl}/v1/invoices`, { customer, status: "open", limit: 25 }), { headers }, z.object({ data: z.array(unknownRecord) }))),
    sourceLink: (objectId: string) => `https://dashboard.stripe.com/${objectId.startsWith("sub_") ? "subscriptions" : objectId.startsWith("in_") ? "invoices" : "customers"}/${objectId}`,
    health: async () => ({ ok: Boolean(await fetchJson(fetcher, `${baseUrl}/v1/customers?limit=1`, { headers }, z.object({ data: z.array(unknownRecord) }))) }),
  };
}

export type ChatwootConfig = { baseUrl: string; apiAccessToken: string; accountId: string | number };
export function createChatwootClient(config: ChatwootConfig, fetcher: FetchLike = fetch) {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const headers = { api_access_token: config.apiAccessToken, accept: "application/json" };
  return {
    searchContacts: async (q: string) => unwrapList(await fetchJson(fetcher, withQuery(`${baseUrl}/api/v1/accounts/${config.accountId}/contacts/search`, { q }), { headers }, listResponse(unknownRecord))),
    getContactConversations: async (contactId: string | number) => unwrapList(await fetchJson(fetcher, `${baseUrl}/api/v1/accounts/${config.accountId}/contacts/${contactId}/conversations`, { headers }, listResponse(unknownRecord))),
    listConversations: async (status = "open") => unwrapList(await fetchJson(fetcher, withQuery(`${baseUrl}/api/v1/accounts/${config.accountId}/conversations`, { status }), { headers }, listResponse(unknownRecord))),
    sourceLink: (conversationId: string | number) => `${baseUrl}/app/accounts/${config.accountId}/conversations/${conversationId}`,
    health: async () => ({ ok: Boolean(await fetchJson(fetcher, `${baseUrl}/api/v1/accounts/${config.accountId}/agents`, { headers }, z.unknown())) }),
  };
}
