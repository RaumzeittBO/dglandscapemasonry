import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { assertGmailConfigured, getEmailBotConfig } from "@/lib/email-bot/config";
import { GmailClient } from "@/lib/email-bot/gmail";
import { sendMetaLeadEvent } from "@/lib/estimate/metaCapi";
import { validateEstimateForm, type EstimateLead } from "@/lib/estimate/schema";
import { setNotificationStatus, storeEstimate } from "@/lib/estimate/storage";

export const runtime = "nodejs";

function fingerprint(lead: EstimateLead) {
  return crypto.createHmac("sha256", process.env.LEAD_HASH_SECRET!)
    .update([lead.email, lead.normalizedPhone, lead.cityOrZip, lead.projectType, lead.projectDetails].join("|").toLowerCase())
    .digest("hex");
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean; hostname?: string };
  const allowedHost = process.env.TURNSTILE_EXPECTED_HOSTNAME;
  return result.success === true && (!allowedHost || result.hostname === allowedHost);
}

function emailBody(lead: EstimateLead, id: string) {
  return [
    "NEW FREE ESTIMATE REQUEST", `Request ID: ${id}`, `Date: ${new Date().toISOString()}`,
    `Name: ${lead.fullName}`, `Phone: ${lead.phone}`, `Email: ${lead.email}`,
    `City / ZIP: ${lead.cityOrZip}`, `Project: ${lead.projectType}`,
    `Details: ${lead.projectDetails}`, `Preferred contact: ${lead.preferredContactMethod}`,
    `Preferred timing: ${lead.preferredEstimateTiming || "Not specified"}`,
    "", "Attribution:", JSON.stringify(lead.attribution, null, 2),
  ].join("\n");
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16_384) return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });

  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 16_384) return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
    input = JSON.parse(raw) as Record<string, unknown>;
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid body");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const validation = validateEstimateForm(input);
  if (!validation.ok) return NextResponse.json({ ok: false, errors: validation.errors, error: "Please correct the highlighted fields." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const turnstileToken = typeof input.turnstileToken === "string" ? input.turnstileToken : "";
  try {
    if (!(await verifyTurnstile(turnstileToken, ip))) {
      return NextResponse.json({ ok: false, error: "Please complete the security check and try again." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Security check is temporarily unavailable. Please try again." }, { status: 503 });
  }

  const lead = validation.lead;
  const eventId = crypto.randomUUID();
  if (!process.env.LEAD_HASH_SECRET) return NextResponse.json({ ok: false, error: "Requests are temporarily unavailable. Please call us." }, { status: 503 });
  const ipHash = crypto.createHmac("sha256", process.env.LEAD_HASH_SECRET).update(ip).digest("hex");

  try {
    const saved = await storeEstimate(lead, ipHash, fingerprint(lead), eventId);
    if (saved.limited) return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
    if (!saved.created) return NextResponse.json({ ok: false, error: "This request was already received. Please call us if you need to add details." }, { status: 409 });
  } catch (error) {
    console.error("Estimate storage failed", { eventId, error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ ok: false, error: "We couldn't save your request. Please try again or call us." }, { status: 503 });
  }

  // The committed database row is the acceptance boundary. Notification and tracking cannot undo it.
  let notification: "sent" | "failed" = "failed";
  const recipient = process.env.ESTIMATE_REQUEST_TO_EMAIL;
  if (recipient === "dglandscapemasonry@gmail.com") {
    try {
      const config = getEmailBotConfig();
      assertGmailConfigured(config);
      await new GmailClient(config).sendEmail(recipient,
        `NEW ESTIMATE REQUEST - ${lead.projectType} - ${lead.cityOrZip}`,
        emailBody(lead, eventId), lead.email);
      notification = "sent";
    } catch (error) {
      console.error("Estimate notification failed", { eventId, error: error instanceof Error ? error.message : "unknown" });
    }
  } else {
    console.error("Estimate notification recipient is not verified", { eventId });
  }
  try {
    await setNotificationStatus(eventId, notification);
  } catch (error) {
    console.error("Estimate notification status update failed", { eventId, error: error instanceof Error ? error.message : "unknown" });
  }

  try {
    const result = await sendMetaLeadEvent({ eventId, lead, clientIp: ip,
      userAgent: request.headers.get("user-agent") || "",
      eventSourceUrl: lead.attribution.landing_page_url || request.headers.get("referer") || "" });
    console.info("Estimate accepted", { eventId, notification, capi: result.ok ? "sent" : "not_sent" });
  } catch (error) {
    console.error("Estimate CAPI failed", { eventId, error: error instanceof Error ? error.message : "unknown" });
  }

  return NextResponse.json({ ok: true, eventId });
}

