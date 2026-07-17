export type EmailBotMode = "draft" | "send";

export type EmailBotConfig = {
  mode: EmailBotMode;
  maxMessages: number;
  lookbackDays: number;
  secret?: string;
  notifyEmail?: string;
  gmail: {
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
  };
  gemini: {
    apiKey?: string;
    model: string;
  };
};

function readInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getEmailBotConfig(): EmailBotConfig {
  const mode = process.env.EMAIL_BOT_MODE === "send" ? "send" : "draft";

  return {
    mode,
    maxMessages: readInteger(process.env.EMAIL_BOT_MAX_MESSAGES, 5),
    lookbackDays: readInteger(process.env.EMAIL_BOT_LOOKBACK_DAYS, 14),
    secret: process.env.EMAIL_BOT_SECRET,
    notifyEmail: process.env.EMAIL_BOT_NOTIFY_EMAIL,
    gmail: {
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    },
  };
}

export function assertGmailConfigured(config: EmailBotConfig) {
  const missing = [
    ["GMAIL_CLIENT_ID", config.gmail.clientId],
    ["GMAIL_CLIENT_SECRET", config.gmail.clientSecret],
    ["GMAIL_REFRESH_TOKEN", config.gmail.refreshToken],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Gmail configuration: ${missing.join(", ")}`);
  }
}
