import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/siteConfig";
import { assertGmailConfigured, getEmailBotConfig } from "@/lib/email-bot/config";
import { GmailClient } from "@/lib/email-bot/gmail";
import { sendMetaLeadEvent } from "@/lib/estimate/metaCapi";
import { validateEstimateForm, type EstimateLead } from "@/lib/estimate/schema";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 4;
const DUPLICATE_WINDOW_MS = 15 * 60 * 1000;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const duplicateStore = new Map<string, number>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "0.0.0.0";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimitStore.get(ip);
  if (!current || current.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function getLeadFingerprint(lead: EstimateLead) {
  return crypto
    .createHash("sha256")
    .update([lead.email, lead.normalizedPhone, lead.cityOrZip, lead.projectType, lead.projectDetails].join("|").toLowerCase())
    .digest("hex");
}

function cleanDuplicateStore() {
  const now = Date.now();
  for (const [key, expiresAt] of duplicateStore.entries()) {
    if (expiresAt < now) duplicateStore.delete(key);
  }
}

function isDuplicateFingerprint(fingerprint: string) {
  cleanDuplicateStore();
  return duplicateStore.has(fingerprint);
}

function markDuplicateFingerprint(fingerprint: string) {
  duplicateStore.set(fingerprint, Date.now() + DUPLICATE_WINDOW_MS);
}

function getNewYorkTimestamp() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "long",
  }).format(new Date());
}

function buildLeadEmailBody(lead: EstimateLead, eventId: string) {
  return [
    "NEW FREE ESTIMATE REQUEST",
    "",
    "Name:",
    lead.fullName,
    "",
    "Phone:",
    lead.phone,
    "",
    "Email:",
    lead.email,
    "",
    "City / ZIP:",
    lead.cityOrZip,
    "",
    "Project Type:",
    lead.projectType,
    "",
    "Project Details:",
    lead.projectDetails,
    "",
    "Preferred Contact Method:",
    lead.preferredContactMethod,
    "",
    "Preferred Estimate Timing:",
    lead.preferredEstimateTiming || "Not specified",
    "",
    "MARKETING ATTRIBUTION",
    "",
    "Landing Page:",
    lead.attribution.landing_page_url || "Not captured",
    "",
    "UTM Source:",
    lead.attribution.utm_source || "Not captured",
    "",
    "UTM Medium:",
    lead.attribution.utm_medium || "Not captured",
    "",
    "UTM Campaign:",
    lead.attribution.utm_campaign || "Not captured",
    "",
    "UTM Content:",
    lead.attribution.utm_content || "Not captured",
    "",
    "UTM Term:",
    lead.attribution.utm_term || "Not captured",
    "",
    "Facebook Click ID:",
    lead.attribution.fbclid || "Not captured",
    "",
    "Submission Date:",
    getNewYorkTimestamp(),
    "",
    "Event ID:",
    eventId,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  const eventDate = new Date().toISOString();
  try {
    let input: Record<string, unknown>;
    try {
      input = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const validation = validateEstimateForm(input);
    if (!validation.ok) {
      return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      console.warn("Estimate request rate limited", { date: eventDate, ipHash: crypto.createHash("sha256").update(ip).digest("hex").slice(0, 12) });
      return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const lead = validation.lead;
    const duplicateFingerprint = getLeadFingerprint(lead);
    if (isDuplicateFingerprint(duplicateFingerprint)) {
      return NextResponse.json({ ok: false, error: "Duplicate request detected." }, { status: 409 });
    }

    const eventId = crypto.randomUUID();
    const config = getEmailBotConfig();
    assertGmailConfigured(config);

    const gmail = new GmailClient(config);
    const recipient = process.env.ESTIMATE_REQUEST_TO_EMAIL || siteConfig.primaryEmail;
    const subject = `NEW ESTIMATE REQUEST - ${lead.projectType} - ${lead.cityOrZip} - ${lead.fullName}`;
    const body = buildLeadEmailBody(lead, eventId);

    try {
      await gmail.sendEmail(recipient, subject, body, lead.email);
      markDuplicateFingerprint(duplicateFingerprint);
      console.info("Estimate request email sent", { eventId, date: eventDate, emailStatus: "sent", storageStatus: "not_applicable" });
    } catch (emailError) {
      console.error("Estimate request email failed", {
        eventId,
        date: eventDate,
        emailStatus: "failed",
        storageStatus: "not_applicable",
        error: emailError instanceof Error ? emailError.message : "Unknown email error",
      });
      return NextResponse.json(
        { ok: false, error: "We couldn't send your request. Please try again or call us at (413) 277-5937." },
        { status: 500 }
      );
    }

    const eventSourceUrl = lead.attribution.landing_page_url || request.headers.get("referer") || "";
    const capiResult = await sendMetaLeadEvent({
      eventId,
      lead,
      clientIp: ip,
      userAgent: request.headers.get("user-agent") || "",
      eventSourceUrl,
    });
    console.info("Estimate request CAPI completed", {
      eventId,
      date: eventDate,
      emailStatus: "sent",
      storageStatus: "not_applicable",
      capiStatus: capiResult.ok ? "sent" : "not_sent",
      capiHttpStatus: "status" in capiResult ? capiResult.status : 200,
    });

    return NextResponse.json({
      ok: true,
      eventId,
      capi: capiResult.ok ? "sent" : "not_sent",
    });
  } catch (error) {
    console.error("Estimate request failed", {
      date: eventDate,
      error: error instanceof Error ? error.message : "Unknown estimate request error",
    });
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request. Please try again or call us at (413) 277-5937." },
      { status: 500 }
    );
  }
}
