"use client";
import { useState } from "react";
import type { DashboardManifest } from "@/lib/dashboards/schema";
import { DashboardRenderer } from "@/components/DashboardRenderer";

type PatchResponse = { manifest: DashboardManifest; validation: { ok: boolean; errors?: string[] } };

export function DashboardCustomizer({ initialManifest }: { initialManifest: DashboardManifest }) {
  const [prompt, setPrompt] = useState("Put incident and support context first for the morning review.");
  const [preview, setPreview] = useState<PatchResponse | null>(null);
  async function generate() {
    const response = await fetch("/api/dashboard-patch", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt }) });
    setPreview(await response.json());
  }
  return <div className="grid cols-2"><section className="card" style={{ padding: 20 }}><h2>AI manifest patch</h2><p className="muted">Merlin generates a declarative manifest patch, never arbitrary React code.</p><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={5} style={{ width: "100%", borderRadius: 18, border: "1px solid var(--line)", background: "#0b1220", color: "var(--text)", padding: 14 }} /><button className="btn primary" onClick={generate} style={{ marginTop: 12 }}>Generate preview</button>{preview && <p>{preview.validation.ok ? "Valid manifest preview. Apply would create a new version." : `Rejected: ${preview.validation.errors?.join(", ")}`}</p>}</section><section><DashboardRenderer manifest={preview?.manifest ?? initialManifest} /></section></div>;
}
