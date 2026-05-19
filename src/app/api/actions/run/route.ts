import { NextResponse } from "next/server";
import { executeAction } from "@/lib/actions/registry";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json(await executeAction(String(body.actionId), body.input, String(body.reason ?? "Operator confirmed")));
}
