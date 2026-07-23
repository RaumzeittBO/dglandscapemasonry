import crypto from "crypto";
import { parseCityAndZip, type EstimateLead } from "./schema";

type SendLeadEventInput = {
  eventId: string;
  lead: EstimateLead;
  clientIp: string;
  userAgent: string;
  eventSourceUrl: string;
};

function normalizeForHash(value: string) {
  return value.trim().toLowerCase();
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(normalizeForHash(value)).digest("hex");
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

export async function sendMetaLeadEvent({ eventId, lead, clientIp, userAgent, eventSourceUrl }: SendLeadEventInput) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn("Meta CAPI skipped: access token not configured", { eventId });
    return { ok: false, skipped: true, reason: "access_token_not_configured" };
  }

  if (!pixelId) {
    console.warn("Meta CAPI skipped: pixel id not configured", { eventId });
    return { ok: false, skipped: true, reason: "pixel_id_not_configured" };
  }

  const graphVersion = process.env.META_GRAPH_API_VERSION || "v25.0";
  const { firstName, lastName } = splitName(lead.fullName);
  const { city, zip } = parseCityAndZip(lead.cityOrZip);
  const userData: Record<string, string | string[]> = {
    em: [sha256(lead.email)],
    ph: [sha256(lead.normalizedPhone.replace(/\D/g, ""))],
    fn: firstName ? [sha256(firstName)] : [],
    ln: lastName ? [sha256(lastName)] : [],
    ct: city ? [sha256(city)] : [],
    st: [sha256("ma")],
    country: [sha256("us")],
    client_ip_address: clientIp,
    client_user_agent: userAgent,
  };

  if (zip) userData.zp = [sha256(zip)];
  if (lead.attribution.fbp) userData.fbp = lead.attribution.fbp;
  if (lead.attribution.fbc) userData.fbc = lead.attribution.fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: {
          lead_type: "free_estimate",
          project_type: lead.projectType,
          preferred_contact_method: lead.preferredContactMethod,
        },
      },
    ],
  };

  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${pixelId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      access_token: accessToken,
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    console.error("Meta CAPI Lead failed", {
      status: response.status,
      error: body.slice(0, 500),
    });
    return { ok: false, skipped: false, status: response.status, body };
  }

  return { ok: true, body };
}
