import { NextResponse } from "next/server";
import { previewAction } from "@/lib/actions/registry";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json(await previewAction(String(body.actionId), body.input));
}
