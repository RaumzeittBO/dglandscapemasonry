type GtagCommand = "config" | "event" | "js";

interface Window {
  gtag?: (command: GtagCommand, target: string | Date, params?: Record<string, unknown>) => void;
  gtag_report_conversion?: (url?: string) => false;
}

