# D&G Landscape and Masonry

Next.js 16, React 19, TypeScript and Tailwind site for [dglandscapemasonry.com](https://dglandscapemasonry.com/). The form at `/#free-estimate` uses a Next.js API route, PostgreSQL, Cloudflare Turnstile, Gmail API, Meta Pixel and optional Meta Conversions API.

## Run locally

1. Install Node.js 24 and run `npm ci`.
2. Copy `.env.example` to `.env.local`; fill in the required values locally. Never commit `.env.local`.
3. Run `docs/estimate-requests.sql` against a private PostgreSQL database. Give the application account only the required table permissions. Enable encrypted connections and restricted console access in the provider.
4. Run `npm run dev` and open `http://localhost:3000/#free-estimate`.

Checks: `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

## Request flow

The client and server validate the fields, including a required project ZIP code. Turnstile verification runs on the server. A PostgreSQL transaction enforces an IP rate limit and detects repeated requests. The transaction saves the request, creation time, contact details, project type, ZIP and ad attribution before the API responds successfully. Gmail notification then runs; its status is saved as `sent` or `failed`. A mail failure never removes an accepted request. The browser sends Pixel `Lead` with the returned `eventId`; optional server CAPI sends the same ID for deduplication. `/thank-you` does not send `Lead` when refreshed.

The PostgreSQL table is the source of truth. Query it for new requests and for `notification_status = 'failed'`; contact those customers manually and investigate Gmail credentials. Restrict database access because rows contain personal information. Decide and implement a retention period before launch.

## Required configuration

Set these in Vercel **Preview** first, then Production after approval:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Private PostgreSQL connection string |
| `LEAD_HASH_SECRET` | Random server secret for pseudonymous IP rate limiting |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile public key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server key |
| `TURNSTILE_EXPECTED_HOSTNAME` | Exact hostname allowed by this environment's Turnstile widget |
| `ESTIMATE_REQUEST_TO_EMAIL` | Confirmed business recipient: `dglandscapemasonry@gmail.com` |
| `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN` | Existing Gmail OAuth sender |
| `NEXT_PUBLIC_META_PIXEL_ID` | `3406030969570155` |

Requests fail closed if `TURNSTILE_EXPECTED_HOSTNAME` is unset or if Turnstile reports a hostname outside the configured allowlist. Optional tracking settings: `META_CAPI_ACCESS_TOKEN`, `META_GRAPH_API_VERSION`, `META_TEST_EVENT_CODE` (Preview test only), and the existing email bot variables documented in `docs/email-bot-setup.md`. Keep credentials server only. Never reveal values in logs or screenshots.

The Vercel project is `proyect` under `gfabrigtrf-7085s-projects`. The free Neon resource `dg-estimates-preview` is connected only to Preview; `docs/estimate-requests.sql` has been applied. Preview uses the `D&G estimate preview` Turnstile widget and the branch's stable Vercel hostname. In the Vercel settings checked on 2026-10-14, Production has `DATABASE_URL`, while the other five intake variables in the table above are Preview-only. Production therefore still needs its own Turnstile configuration, hash secret, and notification recipient before release. See [Preview verification](docs/preview-verification.md) for current test evidence and outstanding Meta access.

## Preview and release

1. Work on a branch other than `main` and push it to GitHub. Git integration should create a Vercel Preview for that branch. Do not deploy `main` until the Preview is accepted.
2. Configure Preview PostgreSQL and Turnstile, apply the SQL migration, and set the Preview variables.
3. Submit one clearly labeled synthetic request such as `TEST PREVIEW - D&G`, then verify the row, Gmail receipt, API response and browser `Lead` event. In Meta Events Manager Test Events, confirm browser/server event IDs match and one deduplicated conversion is counted. A console log is not proof of receipt by Meta.
4. Test invalid fields, missing or invalid Turnstile token, duplicate request, rate limit, and notification failure. Ensure accepted requests remain in PostgreSQL when Gmail fails.
5. Inspect mobile layout and accessibility. Remove synthetic rows after recording test evidence.
6. Present the Preview evidence and request explicit approval before merging or deploying Production. Configure Production database and Turnstile only as part of the approved release.

## Maintenance and access

Repository: `RaumzeittBO/dglandscapemasonry` (currently public). The `pachaxbo-commits` invitation was accepted and write access verified. A draft pull request for this work is open at [#1](https://github.com/RaumzeittBO/dglandscapemasonry/pull/1). For future maintainers, the owner can open **Settings → Collaborators → Add people** and grant write access. The Vercel project owner should also grant the maintenance team appropriate project access.

Update content in `src/config/siteConfig.ts`, `src/data/` and `public/`. Use genuine D&G photos and independently verified business claims. Update dependencies with `npm update` on a branch, run the checks, review the Preview, then release by merging to `main` after approval. Rotate Gmail, Meta, database and Turnstile credentials through their providers and Vercel environment settings; redeploy affected environments.
