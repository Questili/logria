import { NextResponse } from "next/server";
import { answerMerlin } from "@/lib/ai/merlin";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt : "What changed?";
  return NextResponse.json(await answerMerlin(prompt));
}
