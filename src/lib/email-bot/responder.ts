import type { EmailBotConfig } from "./config";
import type { ParsedEmail } from "./gmail";
import { siteConfig } from "@/config/siteConfig";

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

function getEmailText(email: ParsedEmail) {
  return `${email.from}\n${email.subject}\n${email.text}\n${email.snippet || ""}`.toLowerCase();
}

function getBlockedOutreachReason(email: ParsedEmail) {
  const text = getEmailText(email);
  const from = email.from.toLowerCase();

  const blockedSenders = [
    "noreply",
    "no-reply",
    "donotreply",
    "google",
    "openai",
    "mailchimp",
    "constantcontact",
    "hubspot",
  ];

  if (blockedSenders.some((sender) => from.includes(sender))) {
    return "Automated platform or notification email.";
  }

  const vendorPhrases = [
    "website design",
    "web design",
    "redesign your website",
    "improve your website",
    "new website",
    "seo",
    "search engine optimization",
    "google ranking",
    "rank higher",
    "digital marketing",
    "online marketing",
    "social media marketing",
    "lead generation",
    "qualified leads",
    "grow your business",
    "increase your sales",
    "backlinks",
    "domain authority",
    "logo design",
    "app development",
    "outsourcing",
    "virtual assistant",
    "sponsored post",
    "guest post",
  ];

  if (vendorPhrases.some((phrase) => text.includes(phrase))) {
    return "Vendor outreach for web, SEO, marketing, or business services.";
  }

  return null;
}

function getHumanHandoffReason(email: ParsedEmail) {
  const text = getEmailText(email);
  const schedulingPhrases = [
    "schedule",
    "appointment",
    "book",
    "booking",
    "site visit",
    "visit",
    "come by",
    "come take a look",
    "come look",
    "take a look",
    "availability",
    "available",
    "when can you come",
    "can you come",
    "what time",
    "tomorrow",
    "today",
    "next week",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "agendar",
    "cita",
    "visita",
    "horario",
    "cuando pueden",
  ];

  if (schedulingPhrases.some((phrase) => text.includes(phrase))) {
    return "Customer is asking about scheduling or availability. Human should confirm the appointment.";
  }

  return null;
}

function withForcedHumanReview(email: ParsedEmail, decision: LeadDecision): LeadDecision {
  const handoffReason = getHumanHandoffReason(email);
  if (!handoffReason || !decision.isLead) return decision;

  return {
    ...decision,
    needsHumanReview: true,
    summary: `${decision.summary} ${handoffReason}`,
  };
}

function fallbackDecision(email: ParsedEmail): LeadDecision {
  const blockedReason = getBlockedOutreachReason(email);
  if (blockedReason) {
    return {
      isLead: false,
      needsHumanReview: false,
      summary: blockedReason,
      missingInfo: [],
      reply: "",
    };
  }

  const text = getEmailText(email);
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

  return withForcedHumanReview(email, {
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
  });
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

type GeminiModelListResponse = {
  models?: Array<{
    name?: string;
    baseModelId?: string;
    supportedActions?: string[];
    supportedGenerationMethods?: string[];
  }>;
};

function normalizeGeminiModelName(model: string) {
  return model.replace(/^models\//, "").trim();
}

async function listAvailableGeminiModels(apiKey: string) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
    if (!response.ok) return [];

    const data = (await response.json()) as GeminiModelListResponse;
    return (data.models || [])
      .filter((model) => {
        const actions = [...(model.supportedActions || []), ...(model.supportedGenerationMethods || [])];
        return actions.includes("generateContent");
      })
      .flatMap((model) => [model.baseModelId, model.name].filter(Boolean).map((name) => normalizeGeminiModelName(name || "")));
  } catch {
    return [];
  }
}

async function getGeminiModels(apiKey: string, preferredModel: string) {
  const knownModels = [
    preferredModel,
    "gemini-flash-latest",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];

  const availableModels = await listAvailableGeminiModels(apiKey);
  const usefulAvailableModels = availableModels.filter((model) => /flash|lite|pro/i.test(model));

  return Array.from(new Set([...knownModels, ...usefulAvailableModels].map(normalizeGeminiModelName).filter(Boolean)));
}

async function requestGeminiDecision(apiKey: string, model: string, prompt: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
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

  return response;
}

export async function createLeadDecision(email: ParsedEmail, config: EmailBotConfig): Promise<LeadDecision> {
  const blockedReason = getBlockedOutreachReason(email);
  if (blockedReason) {
    return {
      isLead: false,
      needsHumanReview: false,
      summary: blockedReason,
      missingInfo: [],
      reply: "",
    };
  }

  if (!config.gemini.apiKey) return fallbackDecision(email);

  const prompt = [
    "You are an email assistant for D&G Landscape and Masonry Inc.",
    "Classify leads and draft concise, natural replies.",
    "Never promise final pricing. Never invent calendar availability.",
    "Return only valid JSON with keys: isLead boolean, needsHumanReview boolean, summary string, missingInfo string[], reply string.",
    "The reply must be warm, professional, and ask for missing info needed for a free estimate.",
    `Company phone: ${siteConfig.phoneDisplay}.`,
    `Primary email: ${siteConfig.primaryEmail}.`,
    `Published service areas: ${siteConfig.serviceAreas.join(", ")} and nearby towns.`,
    "D&G normally provides free estimates by visiting the property. Do not give final prices by email.",
    "If the customer gives an address or city inside the published service areas, acknowledge the area naturally and continue collecting missing estimate details.",
    "If the customer is near but not exactly listed, say D&G may still serve nearby towns and ask for the full property address/city.",
    "If the customer is clearly far outside Massachusetts/service area, set needsHumanReview true.",
    "If the sender wants to hire D&G for landscaping, lawn care, masonry, patios, walkways, retaining walls, cleanup, or an outdoor project, set isLead true.",
    "If the message offers web design, SEO, marketing, ads, lead generation, software, outsourcing, guest posts, or other vendor services, set isLead false and needsHumanReview false.",
    "If the customer asks to schedule, book, choose a day/time, confirm availability, or asks when someone can come to the property, set isLead true and needsHumanReview true.",
    "If the message is legal, angry, an existing customer complaint, asks about warranties, permits, insurance, contracts, exact price, discounts beyond the published offer, or is unclear, set needsHumanReview true.",
    "If needsHumanReview is true, still draft a short helpful reply for the owner to review, but do not claim that a visit time is confirmed.",
    "The reply must directly address what the customer asked for instead of using a generic template.",
    "",
    `From: ${email.from}`,
    `Subject: ${email.subject}`,
    `Snippet: ${email.snippet || ""}`,
    "Body:",
    email.text,
  ].join("\n");

  const errors: string[] = [];

  for (const model of await getGeminiModels(config.gemini.apiKey, config.gemini.model)) {
    const response = await requestGeminiDecision(config.gemini.apiKey, model, prompt);

    if (!response.ok) {
      errors.push(`${model}: ${response.status}`);
      continue;
    }

    const text = extractGeminiText(await response.json());
    const parsed = safeJsonParse(text);
    if (parsed) return withForcedHumanReview(email, parsed);

    errors.push(`${model}: invalid JSON`);
  }

  return {
    ...fallbackDecision(email),
    needsHumanReview: true,
    summary: `Gemini request failed. Fallback draft created. ${errors.join("; ")}`,
  };
}
