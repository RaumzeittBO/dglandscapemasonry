import type { EmailBotConfig } from "./config";
import type { ParsedEmail } from "./gmail";

export type LeadDecision = {
  isLead: boolean;
  needsHumanReview: boolean;
  summary: string;
  missingInfo: string[];
  reply: string;
};

function safeJsonParse(value: string): LeadDecision | null {
  try {
    return JSON.parse(value) as LeadDecision;
  } catch {
    return null;
  }
}

function fallbackDecision(email: ParsedEmail): LeadDecision {
  const text = `${email.subject}\n${email.text}\n${email.snippet || ""}`.toLowerCase();
  const leadKeywords = [
    "estimate",
    "quote",
    "landscap",
    "masonry",
    "patio",
    "walkway",
    "retaining wall",
    "sod",
    "lawn",
    "cleanup",
    "yard",
    "garden",
  ];
  const isLead = leadKeywords.some((keyword) => text.includes(keyword));

  return {
    isLead,
    needsHumanReview: !isLead,
    summary: isLead ? "Potential landscaping or masonry lead." : "Message does not clearly look like a new lead.",
    missingInfo: ["property address or city", "phone number", "project photos", "preferred site visit times"],
    reply: [
      "Hi,",
      "",
      "Thank you for reaching out to D&G Landscape and Masonry. We would be happy to take a look and help you plan the project.",
      "",
      "To prepare a free estimate, could you please send:",
      "",
      "- The property address or city",
      "- A good phone number",
      "- A few photos of the area",
      "- What you would like done",
      "- The best days or times for a site visit",
      "",
      "Once we have that, we can confirm availability and schedule a quick visit.",
      "",
      "Thank you,",
      "D&G Landscape and Masonry Inc.",
      "(413) 277-5937",
    ].join("\n"),
  };
}

function extractGeminiText(data: unknown) {
  const response = data as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  return (
    response.candidates
      ?.flatMap((candidate) => candidate.content?.parts || [])
      .map((part) => part.text)
      .filter(Boolean)
      .join("\n") || ""
  );
}

export async function createLeadDecision(email: ParsedEmail, config: EmailBotConfig): Promise<LeadDecision> {
  if (!config.gemini.apiKey) return fallbackDecision(email);

  const prompt = [
    "You are an email assistant for D&G Landscape and Masonry Inc.",
    "Classify leads and draft concise, natural replies.",
    "Never promise final pricing. Never invent calendar availability.",
    "Return only valid JSON with keys: isLead boolean, needsHumanReview boolean, summary string, missingInfo string[], reply string.",
    "The reply must be warm, professional, and ask for missing info needed for a free estimate.",
    "If the message is spam, vendor outreach, legal, angry, or unclear, set needsHumanReview true.",
    "",
    `From: ${email.from}`,
    `Subject: ${email.subject}`,
    `Snippet: ${email.snippet || ""}`,
    "Body:",
    email.text,
  ].join("\n");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent`, {
    method: "POST",
    headers: {
      "x-goog-api-key": config.gemini.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    return {
      ...fallbackDecision(email),
      needsHumanReview: true,
      summary: `Gemini request failed. Fallback draft created. Status: ${response.status}`,
    };
  }

  const text = extractGeminiText(await response.json());
  const parsed = safeJsonParse(text);
  if (!parsed) {
    return {
      ...fallbackDecision(email),
      needsHumanReview: true,
      summary: "Gemini returned invalid JSON. Fallback draft created.",
    };
  }

  return parsed;
}
