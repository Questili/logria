import { z } from "zod";

export class ConnectorHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
  ) {
    super(message);
  }
}

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(trimmed)) throw new Error("Connector baseUrl must be an absolute HTTP(S) URL");
  return trimmed;
}

export async function fetchJson<T>(fetcher: FetchLike, url: string, init: RequestInit, schema: z.ZodType<T>): Promise<T> {
  const response = await fetcher(url, init);
  const text = await response.text();
  if (!response.ok) {
    throw new ConnectorHttpError(`Connector request failed: ${response.status}`, response.status, text.slice(0, 1000));
  }
  const json = text ? JSON.parse(text) : null;
  return schema.parse(json);
}

export function withQuery(url: string, params: Record<string, string | number | boolean | undefined>): string {
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) parsed.searchParams.set(key, String(value));
  }
  return parsed.toString();
}
