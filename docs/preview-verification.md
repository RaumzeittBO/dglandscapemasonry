# Estimate intake Preview verification (2026-10-14)

Preview branch: `codex/secure-estimate-intake`  
Stable Preview URL: https://proyect-git-codex-secure-estim-99cbb6-gfabrigtrf-7085s-projects.vercel.app/#free-estimate  
Draft PR: https://github.com/RaumzeittBO/dglandscapemasonry/pull/1

## Verified

- The Vercel Preview build for commit `f506a4d` passed. Production remained on `main` commit `66f06c2`.
- Cloudflare Turnstile rendered on the Preview hostname and completed its managed check during a browser submission.
- A labeled synthetic request produced the confirmation page. Neon `dg-estimates-preview` stored exactly one row with ID `ec9725a4-0a9f-41db-bdc7-658cf6076d17` and `notification_status = 'sent'`.
- Gmail `dglandscapemasonry@gmail.com` received the notification with the same request ID (message `1a138b673b481e43`).
- Repeating the same request showed “This request was already received” and did not create a second row or send another notification.
- Local `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed before the Preview deployment.

## Outstanding before Production release

- Vercel runtime logs for the test request say `Meta CAPI skipped: access token not configured`. A variable named `META_CAPI_ACCESS_TOKEN` is present in Vercel, but it did not supply a usable value to this Preview runtime. The connected Meta account does not show access to Pixel `3406030969570155`. Browser Pixel `Lead` is called after a successful API response, but receipt and deduplication in Meta Events Manager are not verified.
- Verify a rejected request with a missing or invalid Turnstile token using an authenticated Preview API request. The Preview is protected by Vercel Authentication, so unauthenticated terminal requests return Vercel 401 before reaching the app.
- Complete mobile visual review, notification failure test, rate limit test, and a data retention policy before Production release.
- Configure a separate Production database and Turnstile widget/hostname, then obtain explicit release approval before merging or deploying `main`.

The synthetic row is clearly labeled and remains in the Preview database as evidence. Remove it only after the verification record is no longer needed.
