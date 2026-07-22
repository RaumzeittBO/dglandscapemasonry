import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/siteConfig";
import { assertGmailConfigured, getEmailBotConfig } from "@/lib/email-bot/config";
import { GmailClient, type GmailAttachment } from "@/lib/email-bot/gmail";
import { sendMetaLeadEvent } from "@/lib/estimate/metaCapi";
import { validateEstimateForm, type EstimateLead } from "@/lib/estimate/schema";

export const runtime = "nodejs";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 12 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
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

function isDuplicate(lead: EstimateLead) {
  const now = Date.now();
  for (const [key, expiresAt] of duplicateStore.entries()) {
    if (expiresAt < now) duplicateStore.delete(key);
  }

  const fingerprint = crypto
    .createHash("sha256")
    .update([lead.email, lead.normalizedPhone, lead.cityOrZip, lead.projectType, lead.projectDetails].join("|").toLowerCase())
    .digest("hex");

  if (duplicateStore.has(fingerprint)) return true;
  duplicateStore.set(fingerprint, now + DUPLICATE_WINDOW_MS);
  return false;
}

async function parseAttachments(formData: FormData) {
  const files = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
  const errors: string[] = [];
  const attachments: GmailAttachment[] = [];

  if (files.length > MAX_FILES) {
    errors.push("Please attach no more than 5 photos.");
  }

  let totalSize = 0;
  for (const file of files.slice(0, MAX_FILES)) {
    totalSize += file.size;
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      errors.push(`${file.name} must be JPG, PNG, or WEBP.`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name} is larger than 4 MB.`);
      continue;
    }

    attachments.push({
      filename: file.name.replace(/[^\w.\- ]/g, "_").slice(0, 120),
      mimeType: file.type,
      data: Buffer.from(await file.arrayBuffer()),
    });
  }

  if (totalSize > MAX_TOTAL_FILE_SIZE) {
    return { attachments: [], errors: ["Total photo upload size is too large."] };
  }

  return { attachments, errors };
}

function getNewYorkTimestamp() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "long",
  }).format(new Date());
}

function buildLeadEmailBody(lead: EstimateLead, eventId: string, attachments: GmailAttachment[]) {
  const photoText =
    attachments.length > 0
      ? attachments.map((file) => `${file.filename} (${Math.round(file.data.byteLength / 1024)} KB)`).join("\n")
      : "No photos attached.";

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
    "Photos:",
    photoText,
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
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const formData = await request.formData();
    const validation = validateEstimateForm(formData);
    if (!validation.ok) {
      return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
    }

    const lead = validation.lead;
    if (isDuplicate(lead)) {
      return NextResponse.json({ ok: false, error: "Duplicate request detected." }, { status: 409 });
    }

    const { attachments, errors: attachmentErrors } = await parseAttachments(formData);
    const eventId = crypto.randomUUID();
    const config = getEmailBotConfig();
    assertGmailConfigured(config);

    const gmail = new GmailClient(config);
    const recipient = process.env.ESTIMATE_REQUEST_TO_EMAIL || siteConfig.primaryEmail;
    const subject = `NEW ESTIMATE REQUEST - ${lead.projectType} - ${lead.cityOrZip} - ${lead.fullName}`;
    const body = buildLeadEmailBody(lead, eventId, attachments);

    await gmail.sendEmail(recipient, subject, body, attachments, lead.email);

    const eventSourceUrl = lead.attribution.landing_page_url || request.headers.get("referer") || "";
    const capiResult = await sendMetaLeadEvent({
      eventId,
      lead,
      clientIp: ip,
      userAgent: request.headers.get("user-agent") || "",
      eventSourceUrl,
    });

    return NextResponse.json({
      ok: true,
      eventId,
      attachmentWarnings: attachmentErrors,
      capi: capiResult.ok ? "sent" : "not_sent",
    });
  } catch (error) {
    console.error("Estimate request failed", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request. Please try again or call us at (413) 277-5937." },
      { status: 500 }
    );
  }
}
