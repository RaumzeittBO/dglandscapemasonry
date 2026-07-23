export const PROJECT_TYPES = [
  "Landscaping",
  "Patio",
  "Walkway",
  "Retaining Wall",
  "Sod Installation",
  "Hardscape Construction",
  "Commercial Property",
  "Other",
] as const;

export const CONTACT_METHODS = ["Call", "Text Message", "Email"] as const;

export const ESTIMATE_TIMINGS = ["As soon as possible", "This week", "Within the next two weeks", "I'm flexible"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type ContactMethod = (typeof CONTACT_METHODS)[number];
export type EstimateTiming = (typeof ESTIMATE_TIMINGS)[number];

export type EstimateLead = {
  fullName: string;
  phone: string;
  normalizedPhone: string;
  email: string;
  cityOrZip: string;
  projectType: ProjectType;
  projectDetails: string;
  preferredContactMethod: ContactMethod;
  preferredEstimateTiming: EstimateTiming | "";
  consent: true;
  attribution: LeadAttribution;
};

export type LeadAttribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  fbclid: string;
  landing_page_url: string;
  referrer: string;
  submission_timestamp: string;
  fbp: string;
  fbc: string;
};

export type ValidationResult =
  | { ok: true; lead: EstimateLead }
  | { ok: false; errors: Record<string, string> };

const MAX_DETAILS_LENGTH = 1600;

export type EstimateRequestInput = Record<string, unknown>;

function getString(input: EstimateRequestInput, key: string) {
  const value = input[key];
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(input: EstimateRequestInput, key: string) {
  const value = input[key];
  return value === true || value === "true" || value === "on";
}

function sanitizeText(value: string, maxLength = 240) {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return "";
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseCityAndZip(value: string) {
  const zipMatch = value.match(/\b\d{5}(?:-\d{4})?\b/);
  const city = value.replace(/\b\d{5}(?:-\d{4})?\b/g, "").replace(/,\s*ma\b/i, "").trim();
  return {
    city: city || value.trim(),
    zip: zipMatch?.[0] || "",
  };
}

export function validateEstimateForm(input: EstimateRequestInput): ValidationResult {
  const errors: Record<string, string> = {};
  const fullName = sanitizeText(getString(input, "fullName"));
  const phone = sanitizeText(getString(input, "phone"));
  const normalizedPhone = normalizePhone(phone);
  const email = sanitizeText(getString(input, "email").toLowerCase());
  const cityOrZip = sanitizeText(getString(input, "cityOrZip"));
  const projectType = sanitizeText(getString(input, "projectType")) as ProjectType;
  const projectDetails = getString(input, "projectDetails").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, MAX_DETAILS_LENGTH);
  const preferredContactMethod = sanitizeText(getString(input, "preferredContactMethod")) as ContactMethod;
  const preferredEstimateTiming = sanitizeText(getString(input, "preferredEstimateTiming")) as EstimateTiming | "";
  const consent = getBoolean(input, "consent");
  const honeypot = getString(input, "company");

  if (honeypot) errors.company = "Invalid request.";
  if (fullName.length < 2) errors.fullName = "Enter your full name.";
  if (!normalizedPhone) errors.phone = "Enter a valid US phone number.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!cityOrZip) errors.cityOrZip = "Enter your city or ZIP code.";
  if (!PROJECT_TYPES.includes(projectType)) errors.projectType = "Select a project type.";
  if (projectDetails.length < 20) errors.projectDetails = "Tell us a little more about the project.";
  if (projectDetails.length > MAX_DETAILS_LENGTH) errors.projectDetails = "Project details are too long.";
  if (!CONTACT_METHODS.includes(preferredContactMethod)) errors.preferredContactMethod = "Select a contact method.";
  if (preferredEstimateTiming && !ESTIMATE_TIMINGS.includes(preferredEstimateTiming)) errors.preferredEstimateTiming = "Select a valid timing option.";
  if (!consent) errors.consent = "Consent is required.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      fullName,
      phone,
      normalizedPhone,
      email,
      cityOrZip,
      projectType,
      projectDetails,
      preferredContactMethod,
      preferredEstimateTiming,
      consent: true,
      attribution: {
        utm_source: sanitizeText(getString(input, "utm_source")),
        utm_medium: sanitizeText(getString(input, "utm_medium")),
        utm_campaign: sanitizeText(getString(input, "utm_campaign")),
        utm_content: sanitizeText(getString(input, "utm_content")),
        utm_term: sanitizeText(getString(input, "utm_term")),
        fbclid: sanitizeText(getString(input, "fbclid")),
        landing_page_url: getString(input, "landing_page_url").slice(0, 1000),
        referrer: getString(input, "referrer").slice(0, 1000),
        submission_timestamp: sanitizeText(getString(input, "submission_timestamp")),
        fbp: sanitizeText(getString(input, "fbp"), 500),
        fbc: sanitizeText(getString(input, "fbc"), 500),
      },
    },
  };
}
