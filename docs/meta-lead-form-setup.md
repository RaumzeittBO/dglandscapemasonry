# Meta Lead Form + Pixel/CAPI Setup

This branch prepares D&G Landscape and Masonry Inc. for Meta Ads with:

- Objective: Leads
- Conversion location: Website
- Performance goal: Maximize number of conversions
- Conversion event: Lead

The current launch uses Meta Pixel from the browser. Conversions API is implemented but optional and inactive until `META_CAPI_ACCESS_TOKEN` is added.

## Lead Flow

```text
Meta Ad
-> Landing page
-> Free On-Site Estimate form
-> Backend validates request
-> Backend sends email to the AI-bot inbox
-> Backend responds success with event_id
-> Browser fires Meta Pixel Lead with that event_id
-> Browser redirects to /thank-you
```

Do not count as Lead:

- Landing visits.
- CTA clicks.
- Scroll to the form.
- Starting the form.
- Validation errors.
- Email failures.
- Loading or reloading `/thank-you`.

## Environment Variables

Required for this phase:

```text
NEXT_PUBLIC_META_PIXEL_ID=3406030969570155
ESTIMATE_REQUEST_TO_EMAIL=dglandscapemasonry@gmail.com
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
```

Optional:

```text
META_CAPI_ACCESS_TOKEN=
META_TEST_EVENT_CODE=
META_GRAPH_API_VERSION=v25.0
```

`META_CAPI_ACCESS_TOKEN` must never be prefixed with `NEXT_PUBLIC_`.

`META_GRAPH_API_VERSION=v25.0` is used because Meta lists Graph API v25.0 as released on February 18, 2026 and available in the official Graph API changelog.

If `META_CAPI_ACCESS_TOKEN` is missing or empty:

- CAPI is skipped.
- The form still works.
- The email still sends.
- The backend still returns `eventId`.
- Browser Pixel still sends `Lead`.
- Server logs: `Meta CAPI skipped: access token not configured`.

## Form Fields

The form does not include photos. The AI bot can request photos later by email if needed.

Required:

- Full Name
- Phone Number
- Email Address
- City or ZIP Code
- Project Type
- Preferred Contact Method
- Consent checkbox

Optional:

- Preferred Estimate Timing
- Project Description

## Backend Guarantees

`/api/estimate-request` receives JSON, not multipart form data.

Processing order:

1. Parse JSON.
2. Validate and sanitize fields.
3. Check honeypot.
4. Apply basic rate limiting.
5. Prevent immediate duplicate submissions.
6. Generate UUID `event_id`.
7. Send email.
8. If email fails, return error and do not call CAPI.
9. If email succeeds, attempt CAPI only when token exists.
10. Return success with `event_id`.
11. Browser fires Pixel `Lead` using that same `event_id`.
12. Browser redirects to `/thank-you`.

If CAPI fails after the email is sent, the lead is preserved and the visitor still receives confirmation.

## Current Protections

- Client and server validation.
- Server sanitization.
- Honeypot field.
- Browser double-click prevention.
- Basic in-memory rate limiting.
- Basic in-memory duplicate prevention.

Future upgrade for higher spend: move rate limits and duplicate fingerprints to persistent storage such as Upstash Redis.

## Vercel Preview Test Steps

1. Open Vercel project settings.
2. Add the required variables to the `Preview` environment.
3. Leave `META_CAPI_ACCESS_TOKEN` empty until Meta grants/generates the token.
4. Add `META_TEST_EVENT_CODE` only if testing inside Meta Events Manager.
5. Redeploy the preview for branch `feat/meta-lead-form-capi`.
6. Open Meta Events Manager -> D&G Pixel -> Test Events.
7. Open the Vercel Preview URL.
8. Confirm `PageView` appears.
9. Click `Request My Free Estimate` and confirm no `Lead` appears.
10. Submit a valid form.
11. Confirm email arrives at `ESTIMATE_REQUEST_TO_EMAIL`.
12. Confirm Browser `Lead` appears with the returned `event_id`.
13. Reload `/thank-you` and confirm no new `Lead` appears.
14. Test on mobile viewport or a real phone.
15. Add the same required variables to `Production` only after Preview is approved.
16. Merge to `main` only after Preview approval.

When `META_CAPI_ACCESS_TOKEN` is later configured:

1. Redeploy Preview.
2. Submit a valid form.
3. Confirm both Browser and Server `Lead` events appear.
4. Confirm both use the same `event_id`.
5. Confirm Meta deduplicates the events into one Lead.

## Manual Validation Checklist

- Valid form submits.
- Invalid form is rejected.
- Email failure does not return success.
- Email success returns `event_id`.
- Pixel `Lead` uses the returned `event_id`.
- CTA click does not fire `Lead`.
- `/thank-you` load/reload does not fire `Lead`.
- UTM values and `fbclid` appear in the email.
- `_fbp` and `_fbc` are sent when available.
- Honeypot blocks spam-like submissions.
- Rate limit returns a controlled response.
- No file upload field is present.
- `META_CAPI_ACCESS_TOKEN` is not present in client code.
- `npm run lint` passes.
- `npm run build` passes.
- No secrets are versioned.

## Logs

Check Vercel logs for:

- `/api/estimate-request`
- `Estimate request email sent`
- `Estimate request email failed`
- `Meta CAPI skipped: access token not configured`
- `Meta CAPI Lead failed`

Logs include `eventId`, status, date, and sanitized errors. They must not include tokens, project descriptions, or unnecessary personal information.
