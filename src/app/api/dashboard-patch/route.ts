import { NextResponse } from "next/server";
import { demoUser } from "@/lib/demo-data";
import { defaultDashboard, generateManifestPatch, validateDashboardManifest } from "@/lib/dashboards/validator";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt : "Reorder dashboard";
  const manifest = { ...defaultDashboard, ...generateManifestPatch(prompt) };
  const validation = validateDashboardManifest(manifest, demoUser.role);
  return NextResponse.json({ patch: generateManifestPatch(prompt), manifest, validation });
}
