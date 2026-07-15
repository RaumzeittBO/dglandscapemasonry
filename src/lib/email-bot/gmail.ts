import type { EmailBotConfig } from "./config";

export type GmailHeader = {
  name: string;
  value: string;
};

export type GmailMessagePart = {
  mimeType?: string;
  filename?: string;
  body?: {
    data?: string;
  };
  parts?: GmailMessagePart[];
};

export type GmailMessage = {
  id: string;
  threadId: string;
  labelIds?: string[];
  payload?: {
    headers?: GmailHeader[];
    body?: {
      data?: string;
    };
    parts?: GmailMessagePart[];
    mimeType?: string;
  };
  snippet?: string;
};

export type ParsedEmail = {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  messageId?: string;
  references?: string;
  text: string;
  snippet?: string;
};

type GmailListResponse = {
  messages?: Array<{ id: string; threadId: string }>;
};

type GmailLabelsResponse = {
  labels?: Array<{ id: string; name: string }>;
};

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getHeader(headers: GmailHeader[] | undefined, name: string) {
  return headers?.find((header) => header.name.toLowerCase() === name.toLowerCase())?.value || "";
}

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractTextFromPart(part: GmailMessagePart | GmailMessage["payload"] | undefined): string {
  if (!part) return "";

  if (part.mimeType === "text/plain" && part.body?.data) {
    return base64UrlDecode(part.body.data);
  }

  if (part.mimeType === "text/html" && part.body?.data) {
    return stripHtml(base64UrlDecode(part.body.data));
  }

  const nested = part.parts?.map(extractTextFromPart).filter(Boolean).join("\n\n");
  if (nested) return nested;

  if (part.body?.data) {
    return base64UrlDecode(part.body.data);
  }

  return "";
}

function escapeHeader(value: string) {
  return value.replace(/\r|\n/g, " ").trim();
}

function buildReplyRaw(email: ParsedEmail, body: string, fromEmail?: string) {
  const headers = [
    `To: ${escapeHeader(email.from)}`,
    fromEmail ? `From: ${escapeHeader(fromEmail)}` : "",
    `Subject: ${escapeHeader(email.subject.toLowerCase().startsWith("re:") ? email.subject : `Re: ${email.subject}`)}`,
    email.messageId ? `In-Reply-To: ${escapeHeader(email.messageId)}` : "",
    email.references || email.messageId ? `References: ${escapeHeader([email.references, email.messageId].filter(Boolean).join(" "))}` : "",
    "Content-Type: text/plain; charset=UTF-8",
  ].filter(Boolean);

  return base64UrlEncode(`${headers.join("\r\n")}\r\n\r\n${body}`);
}

export class GmailClient {
  private accessToken?: string;

  constructor(private readonly config: EmailBotConfig) {}

  private async getAccessToken() {
    if (this.accessToken) return this.accessToken;

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.config.gmail.clientId || "",
        client_secret: this.config.gmail.clientSecret || "",
        refresh_token: this.config.gmail.refreshToken || "",
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error(`Gmail token request failed: ${response.status} ${await response.text()}`);
    }

    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) throw new Error("Gmail token response did not include access_token");

    this.accessToken = data.access_token;
    return data.access_token;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Gmail API request failed: ${response.status} ${await response.text()}`);
    }

    return (await response.json()) as T;
  }

  async searchLeadMessages(query: string, maxResults: number) {
    const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });
    const result = await this.request<GmailListResponse>(`/messages?${params.toString()}`);
    return result.messages || [];
  }

  async getMessage(messageId: string) {
    const params = new URLSearchParams({ format: "full" });
    return this.request<GmailMessage>(`/messages/${messageId}?${params.toString()}`);
  }

  parseMessage(message: GmailMessage): ParsedEmail {
    const headers = message.payload?.headers || [];
    return {
      id: message.id,
      threadId: message.threadId,
      from: getHeader(headers, "From"),
      to: getHeader(headers, "To"),
      subject: getHeader(headers, "Subject") || "(no subject)",
      messageId: getHeader(headers, "Message-ID"),
      references: getHeader(headers, "References"),
      text: extractTextFromPart(message.payload).slice(0, 12000),
      snippet: message.snippet,
    };
  }

  async ensureLabel(name: string) {
    const labels = await this.request<GmailLabelsResponse>("/labels");
    const existing = labels.labels?.find((label) => label.name === name);
    if (existing) return existing.id;

    const created = await this.request<{ id: string }>("/labels", {
      method: "POST",
      body: JSON.stringify({
        name,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      }),
    });

    return created.id;
  }

  async applyLabels(messageId: string, labelNames: string[]) {
    const labelIds = await Promise.all(labelNames.map((name) => this.ensureLabel(name)));
    await this.request(`/messages/${messageId}/modify`, {
      method: "POST",
      body: JSON.stringify({ addLabelIds: labelIds }),
    });
  }

  async createReplyDraft(email: ParsedEmail, body: string) {
    const raw = buildReplyRaw(email, body);
    const draft = await this.request<{ id: string; message: { id: string } }>("/drafts", {
      method: "POST",
      body: JSON.stringify({
        message: {
          raw,
          threadId: email.threadId,
        },
      }),
    });

    return draft;
  }

  async sendReply(email: ParsedEmail, body: string) {
    const raw = buildReplyRaw(email, body);
    const sent = await this.request<{ id: string; threadId: string }>("/messages/send", {
      method: "POST",
      body: JSON.stringify({
        raw,
        threadId: email.threadId,
      }),
    });

    return sent;
  }

  async sendInternalNotification(to: string, subject: string, body: string) {
    const raw = base64UrlEncode(
      [
        `To: ${escapeHeader(to)}`,
        `Subject: ${escapeHeader(subject)}`,
        "Content-Type: text/plain; charset=UTF-8",
        "",
        body,
      ].join("\r\n")
    );

    return this.request<{ id: string; threadId: string }>("/messages/send", {
      method: "POST",
      body: JSON.stringify({ raw }),
    });
  }
}
