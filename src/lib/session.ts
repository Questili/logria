import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { demoUser, demoWorkspace } from "./demo-data";
import { ensureDemoPersistence } from "./persistence";

const cookieName = "logria_session";
const defaultSecret = "logria-dev-session-secret-change-me";

function secret() { return process.env.AUTH_SECRET ?? defaultSecret; }
function sign(payload: string) { return createHmac("sha256", secret()).update(payload).digest("base64url"); }

export type LogriaSession = { userId: string; email: string; workspaceId: string; role: typeof demoUser.role; exp: number };

export function createSessionToken(session: LogriaSession): string {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): LogriaSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;
  const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as LogriaSession;
  return session.exp > Date.now() ? session : null;
}

export async function createDemoSession(): Promise<string> {
  await ensureDemoPersistence();
  return createSessionToken({ userId: demoUser.id, email: demoUser.email, workspaceId: demoWorkspace.id, role: demoUser.role, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
}

export async function readSession(): Promise<LogriaSession> {
  const cookieStore = await cookies();
  const verified = verifySessionToken(cookieStore.get(cookieName)?.value);
  if (verified) return verified;
  if (process.env.LOGRIA_DEMO_MODE !== "false") {
    return { userId: demoUser.id, email: demoUser.email, workspaceId: demoWorkspace.id, role: demoUser.role, exp: Date.now() + 1000 * 60 * 60 };
  }
  throw new Error("Authentication required");
}

export { cookieName };
