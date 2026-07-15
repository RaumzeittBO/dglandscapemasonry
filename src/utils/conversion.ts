export function reportConversion() {
  if (typeof window === "undefined") return;
  window.gtag_report_conversion?.();
}

