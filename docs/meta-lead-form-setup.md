# Meta Lead Form + CAPI Setup

This project includes a server-processed free estimate form at:

`/#free-estimate`

The Lead event is only fired after:

1. The form validates successfully.
2. The backend sends the estimate request email.
3. The backend sends or attempts Meta CAPI.
4. The browser receives a successful response with an `eventId`.

Loading `/thank-you`, clicking a CTA, opening email, or starting the form does not fire `Lead`.

## Environment Variables

Public browser variable:

```text
NEXT_PUBLIC_META_PIXEL_ID=
```

Private server variables:

```text
META_CAPI_ACCESS_TOKEN=
META_TEST_EVENT_CODE=
META_GRAPH_API_VERSION=v25.0
ESTIMATE_REQUEST_TO_EMAIL=
```

`META_CAPI_ACCESS_TOKEN` must never be prefixed with `NEXT_PUBLIC_`.

`META_GRAPH_API_VERSION=v25.0` is used because Meta lists Graph API v25.0 as released on February 18, 2026 and available in the official Graph API changelog.

If `ESTIMATE_REQUEST_TO_EMAIL` is empty, the form sends to `siteConfig.primaryEmail`.

Recommended current value:

```text
ESTIMATE_REQUEST_TO_EMAIL=dglandscapemasonry@gmail.com
```

The form email uses the existing Gmail OAuth variables:

```text
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
```

## How To Test Locally

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/#free-estimate
```

Submit a valid test request. Expected result:

- Email arrives at `ESTIMATE_REQUEST_TO_EMAIL` or `dglandscapemasonry@gmail.com`.
- The response contains an `eventId`.
- Browser fires Meta Pixel `Lead` with that same `eventId`.
- Server sends CAPI `Lead` with that same `eventId`.
- Browser redirects to `/thank-you`.

## How To Test Meta Events

1. In Meta Events Manager, open the Pixel.
2. Go to Test Events.
3. Copy the test event code.
4. Set it in Vercel:

```text
META_TEST_EVENT_CODE=
```

5. Redeploy the preview environment.
6. Submit the form from the preview URL.
7. Confirm both Browser and Server `Lead` events appear.
8. Confirm deduplication shows one Lead, not two.

Remove `META_TEST_EVENT_CODE` before production campaigns unless you intentionally want test routing.

## Logs

Check Vercel logs for:

- `/api/estimate-request`
- `Meta CAPI Lead failed`
- `Estimate request failed`

If CAPI fails after the email is sent, the user still receives confirmation and the lead is not lost.

## Current Protections

- Server-side validation and sanitization.
- Honeypot field.
- Double-click prevention in the browser.
- Basic in-memory rate limiting.
- Basic in-memory duplicate prevention.

For production campaigns with higher spend, move rate limiting and duplicate fingerprints to persistent storage such as Upstash Redis. The initial release keeps the simpler implementation because the form no longer uploads files and the lead is preserved by email before CAPI is attempted.

## Manual Validation Checklist

- Valid form submits.
- Invalid form is rejected.
- Double submit is prevented by disabled button and duplicate detection.
- UTM values are preserved in the email.
- `fbclid`, `_fbp`, and `_fbc` are captured when present.
- No file upload field is present.
- `/thank-you` refresh does not fire `Lead`.
- `META_CAPI_ACCESS_TOKEN` is not present in client code.
- Mobile layout remains usable.
