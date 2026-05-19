"use client";
import { useState } from "react";

type ActionResponse = { status: string; message: string; idempotencyKey: string; rollbackNotes: string };

export function ActionPanel() {
  const [preview, setPreview] = useState<ActionResponse | null>(null);
  const [result, setResult] = useState<ActionResponse | null>(null);
  const input = { accountId: "acct_northstar", note: "Follow up on sync timeout and failed renewal" };
  async function post(url: string) {
    const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ actionId: "ops.mark_follow_up_needed", input, reason: "Demo operator confirmed from Logria" }) });
    return response.json() as Promise<ActionResponse>;
  }
  return <section className="card" style={{ padding: 20 }}><h2>Safe action demo</h2><p className="muted">Merlin may propose this, but execution still requires preview, confirmation, reason, idempotency, and audit.</p><button className="btn" onClick={async () => setPreview(await post("/api/actions/preview"))}>Preview low-risk action</button><button className="btn primary" onClick={async () => setResult(await post("/api/actions/run"))} style={{ marginLeft: 10 }}>Confirm and run</button>{preview && <p>Preview: {preview.message}</p>}{result && <p>Result: {result.message} · rollback: {result.rollbackNotes}</p>}</section>;
}
