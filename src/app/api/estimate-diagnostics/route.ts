import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "form_view",
  "form_start",
  "submit_attempt",
  "validation_error",
  "send_error",
]);

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let event: unknown;
  try {
    const body = await request.json();
    event = body && typeof body === "object" && !Array.isArray(body) ? body.event : undefined;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof event !== "string" || !ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Only a fixed event label is logged; request fields and personal data are discarded.
  console.info("Estimate form diagnostic", { event });
  return NextResponse.json({ ok: true }, { status: 202 });
}
