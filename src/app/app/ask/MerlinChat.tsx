"use client";
import { useState } from "react";
import { EvidenceList } from "@/components/Cards";
import type { Evidence } from "@/lib/types";

type ChatResponse = { answer: string; evidence: Evidence[]; toolCalls: { toolId: string; outputSummary: string }[]; partial: boolean; refused?: boolean };

export function MerlinChat() {
  const [prompt, setPrompt] = useState("Why did revenue change and which customers are affected by incidents?");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  async function ask() {
    setLoading(true);
    const result = await fetch("/api/merlin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt }) });
    setResponse(await result.json());
    setLoading(false);
  }
  return <div className="grid cols-2"><section className="card" style={{ padding: 20 }}><h2>Ask Merlin</h2><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} style={{ width: "100%", borderRadius: 18, border: "1px solid var(--line)", background: "#0b1220", color: "var(--text)", padding: 14 }} /><button className="btn primary" onClick={ask} disabled={loading} style={{ marginTop: 12 }}>{loading ? "Asking…" : "Ask with evidence"}</button></section>{response && <section className="card" style={{ padding: 20 }}><h2>{response.refused ? "Refusal" : "Answer"}</h2><pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{response.answer}</pre><h3>Evidence</h3><EvidenceList evidence={response.evidence} /><h3>Tool timeline</h3>{response.toolCalls.map((call) => <p key={call.toolId} className="muted"><strong>{call.toolId}</strong>: {call.outputSummary}</p>)}</section>}</div>;
}
