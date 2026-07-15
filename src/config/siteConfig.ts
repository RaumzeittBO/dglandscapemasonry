export const siteConfig = {
  companyName: "D&G Landscape and Masonry Inc.",
  phoneDisplay: "(413) 277-5937",
  phoneE164: "+14132775937",
  primaryEmail: "dglandscapemasonry@gmail.com",
  bookingUrl: "",
  googleReviewsUrl: "https://www.google.com/search?q=D%26G+Landscape+and+Masonry#lrd=0x89e38e1a6be1a051:0xa5f4e64f0288820c,1",
  serviceAreas: [
    "Weston, MA",
    "Lincoln, MA",
    "Concord, MA",
    "Wellesley, MA",
    "Wayland, MA",
    "Lexington, MA",
    "Needham, MA",
    "Dedham, MA",
    "Westwood, MA",
    "Sherborn, MA",
    "Waltham, MA",
    "Watertown, MA",
    "Medford, MA",
  ],
} as const;

export function getCallUrl() {
  return `tel:${siteConfig.phoneE164}`;
}

export function getSmsUrl() {
  return `sms:${siteConfig.phoneE164}`;
}

export function getEmailUrl() {
  const subject = "Free estimate request - D&G Landscape and Masonry";
  const body = [
    "Hi D&G Landscape and Masonry,",
    "",
    "I would like a free estimate for my property.",
    "",
    "Name:",
    "Phone number:",
    "Property address / city:",
    "Best days or times for a site visit:",
    "",
    "What do you need help with?",
    "- Landscaping / cleanup / maintenance:",
    "- Patio / walkway / retaining wall / masonry:",
    "- Sod installation / lawn repair:",
    "- Other:",
    "",
    "Project details:",
    "",
    "Approximate timeline:",
    "",
    "Please attach photos of the area if you can. Photos help us understand the project faster.",
    "",
    "Thank you.",
  ].join("\n");

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.primaryEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getMailtoUrl() {
  const subject = "Free estimate request - D&G Landscape and Masonry";
  return `mailto:${siteConfig.primaryEmail}?subject=${encodeURIComponent(subject)}`;
}
