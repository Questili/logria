import { NextResponse } from "next/server";
import { cookieName, createDemoSession } from "@/lib/session";

export async function POST() {
  const token = await createDemoSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return response;
}
