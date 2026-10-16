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
  const requestHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
    || request.headers.get("host");
  let originUrl: URL | undefined;
  try {
    if (origin) originUrl = new URL(origin);
  } catch {
    originUrl = undefined;
  }
  const localHttp = originUrl?.protocol === "http:" && ["localhost", "127.0.0.1"].includes(originUrl.hostname);
  if (!originUrl || originUrl.host !== requestHost || (originUrl.protocol !== "https:" && !localHttp)) {
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
