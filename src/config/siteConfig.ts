export const siteConfig = {
  companyName: "D&G Landscape and Masonry Inc.",
  phoneDisplay: "(413) 277-5937",
  phoneE164: "+14132775937",
  primaryEmail: "dglandscapemasonry+sales@gmail.com",
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
  return `mailto:${siteConfig.primaryEmail}`;
}
