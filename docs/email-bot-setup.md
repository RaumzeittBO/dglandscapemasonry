# Email Bot Setup

This project includes a deployable email bot endpoint:

`POST /api/email-bot/run`

It checks Gmail, classifies new inbox messages, creates reply drafts, applies Gmail labels, and can optionally notify an internal email.

## Current Default

Default mode is safe:

`EMAIL_BOT_MODE=draft`

That means the bot creates Gmail drafts but does not send replies automatically.

## Required Environment Variables

Set these in Vercel Project Settings > Environment Variables:

- `EMAIL_BOT_SECRET`
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`

Optional:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `EMAIL_BOT_NOTIFY_EMAIL`
- `EMAIL_BOT_MAX_MESSAGES`
- `EMAIL_BOT_LOOKBACK_DAYS`

If `GEMINI_API_KEY` is missing, the bot still works with a safe template reply. It will be less natural, but it will not fail.

## How To Run Manually

Send a POST request:

```bash
curl -X POST https://YOUR_DOMAIN/api/email-bot/run \
  -H "Authorization: Bearer YOUR_EMAIL_BOT_SECRET"
```

## Gmail OAuth Setup

You need a Google Cloud OAuth app with Gmail API enabled.

Required Gmail scopes:

- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.compose`
- `https://www.googleapis.com/auth/gmail.send`

The refresh token must belong to:

`dglandscapemasonry@gmail.com`

## Recommended Launch

1. Keep `EMAIL_BOT_MODE=draft`.
2. Run manually with one or two test emails.
3. Review drafts in Gmail.
4. Adjust tone/personality.
5. Add scheduling/calendar logic.
6. Only then consider `EMAIL_BOT_MODE=send`.

## Owner Notifications

Set `EMAIL_BOT_NOTIFY_EMAIL` to send an internal summary whenever a draft is created.

For WhatsApp notifications, use WhatsApp Business API or Twilio later.

For Telegram notifications, add a Telegram bot token and chat id later. Telegram is usually simpler than WhatsApp for internal alerts.
