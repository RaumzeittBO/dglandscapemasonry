"use client";

import Script from "next/script";
import { useEffect } from "react";
import { getEmailUrl, getMailtoUrl, siteConfig } from "@/config/siteConfig";

// Replace these with your actual IDs when ready
const GTM_ID = "AW-18018618559"; 
const CALL_CONVERSION_ID = "AW-18018618559/call-conversion";
const EMAIL_CONVERSION_ID = "AW-18018618559/email-conversion";

export default function GoogleAnalytics() {
  useEffect(() => {
    const isMobileDevice = () => /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);

    const openMobileEmailComposer = () => {
      const mailtoUrl = getMailtoUrl();
      const gmailWebUrl = getEmailUrl();

      window.location.href = mailtoUrl;

      window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          window.location.href = gmailWebUrl;
        }
      }, 1200);
    };

    const handleGlobalClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Extract raw phone number and email
      const phoneE164 = siteConfig.phoneE164;
      const primaryEmail = siteConfig.primaryEmail;

      // Check if clicked link is a phone call link
      if (href === `tel:${phoneE164}` || href === `sms:${phoneE164}`) {
        if (typeof window.gtag === "function") {
          window.gtag("event", "conversion", {
            send_to: CALL_CONVERSION_ID,
          });
          console.debug("Google Ads: Call Conversion Event Fired");
        }
      }

      // Check if clicked link is an email link
      if (href.startsWith(`mailto:${primaryEmail}`) || href.includes(`to=${encodeURIComponent(primaryEmail)}`)) {
        if (typeof window.gtag === "function") {
          window.gtag("event", "conversion", {
            send_to: EMAIL_CONVERSION_ID,
          });
          console.debug("Google Ads: Email Conversion Event Fired");
        }

        if (isMobileDevice()) {
          e.preventDefault();
          openMobileEmailComposer();
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GTM_ID}');

          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.location = url;
              }
            };
            gtag('event', 'conversion', {
              'send_to': 'AW-18018618559/MNpeCN72r4kcEL-Z-Y9D',
              'value': 1.0,
              'currency': 'USD',
              'event_callback': callback
            });
            return false;
          }
          window.gtag_report_conversion = gtag_report_conversion;
        `}
      </Script>
    </>
  );
}
