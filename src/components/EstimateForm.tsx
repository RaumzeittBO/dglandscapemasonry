"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { CONTACT_METHODS, ESTIMATE_TIMINGS, PROJECT_TYPES, normalizePhone } from "@/lib/estimate/schema";
import { getCallUrl, getPrivacyPolicyUrl, siteConfig } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";

type SubmitState = "idle" | "sending" | "success" | "error";
type FieldErrors = Record<string, string>;

const FIELD_CLASS =
  "mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm font-semibold text-charcoal shadow-sm transition focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20";
const LABEL_CLASS = "text-sm font-black text-charcoal";

function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
}

function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    fbclid: params.get("fbclid") || "",
    landing_page_url: window.location.href,
    referrer: document.referrer || "",
    submission_timestamp: new Date().toISOString(),
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
  };
}

export default function EstimateForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const normalizedPhone = normalizePhone(String(formData.get("phone") || ""));

    setError("");
    setFieldErrors({});

    if (!normalizedPhone) {
      setFieldErrors({ phone: "Please enter a valid US phone number." });
      setError("Please enter a valid US phone number.");
      return;
    }

    const attribution = getAttribution();
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      cityOrZip: String(formData.get("cityOrZip") || ""),
      projectType: String(formData.get("projectType") || ""),
      projectDetails: String(formData.get("projectDetails") || ""),
      preferredContactMethod: String(formData.get("preferredContactMethod") || ""),
      preferredEstimateTiming: String(formData.get("preferredEstimateTiming") || ""),
      consent: formData.get("consent") === "on",
      company: String(formData.get("company") || ""),
      ...attribution,
    };

    setState("sending");

    try {
      const response = await fetch("/api/estimate-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        eventId?: string;
        error?: string;
        errors?: FieldErrors;
      };

      if (!response.ok || !result.ok || !result.eventId) {
        if (result.errors) setFieldErrors(result.errors);
        throw new Error(result.error || "We couldn't send your request. Please try again or call us at (413) 277-5937.");
      }

      window.fbq?.(
        "track",
        "Lead",
        {
          content_name: "Free On-Site Estimate",
          content_category: "Landscaping and Masonry",
          lead_type: "estimate_request",
        },
        {
          eventID: result.eventId,
        }
      );

      reportConversion();
      setState("success");
      formRef.current?.reset();
      window.setTimeout(() => router.push("/thank-you"), 450);
    } catch (submitError) {
      setState("error");
      setError(submitError instanceof Error ? submitError.message : "We couldn't send your request. Please try again or call us at (413) 277-5937.");
    }
  };

  return (
    <section id="free-estimate" className="bg-offwhite px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-start">
        <div className="reveal-element lg:sticky lg:top-28">
          <span className="inline-flex rounded-full bg-moss px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
            Free on-site estimate
          </span>
          <h2 className="mt-6 font-heading text-5xl font-bold leading-[0.98] text-charcoal sm:text-6xl">
            Request Your Free On-Site Estimate
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-charcoal/66">
            Tell us about your project. Our team will review your request and contact you shortly.
          </p>
          <p className="mt-4 text-sm font-bold text-moss">
            No obligation. Serving Waltham, MA and surrounding areas.
          </p>
          <div className="mt-8 rounded-2xl border border-charcoal/8 bg-white p-5 text-sm leading-6 text-charcoal/64 shadow-sm">
            Free estimates are coordinated by call, text, or email. The team can request anything else needed after reviewing your project details.
          </div>
          <a
            href={getCallUrl()}
            onClick={reportConversion}
            className="mt-6 inline-flex rounded-full border border-moss/20 px-6 py-3 text-sm font-black text-moss transition hover:bg-white"
          >
            Need immediate help? Call/Text {siteConfig.phoneDisplay}
          </a>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="reveal-element rounded-[1.5rem] border border-charcoal/8 bg-white p-5 shadow-[0_28px_90px_rgba(12,18,14,0.1)] sm:p-8">
          <div className="hidden">
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className={LABEL_CLASS}>
              Full Name *
              <input className={FIELD_CLASS} name="fullName" autoComplete="name" minLength={2} required aria-invalid={Boolean(fieldErrors.fullName)} aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined} />
              {fieldErrors.fullName && <span id="fullName-error" className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.fullName}</span>}
            </label>

            <label className={LABEL_CLASS}>
              Phone Number *
              <input className={FIELD_CLASS} name="phone" autoComplete="tel" inputMode="tel" placeholder="(413) 555-0123" required aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "phone-error" : undefined} />
              {fieldErrors.phone && <span id="phone-error" className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.phone}</span>}
            </label>

            <label className={LABEL_CLASS}>
              Email Address *
              <input className={FIELD_CLASS} name="email" type="email" autoComplete="email" inputMode="email" required aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} />
              {fieldErrors.email && <span id="email-error" className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.email}</span>}
            </label>

            <label className={LABEL_CLASS}>
              City or ZIP Code *
              <input className={FIELD_CLASS} name="cityOrZip" autoComplete="address-level2 postal-code" placeholder="Waltham or 02453" required aria-invalid={Boolean(fieldErrors.cityOrZip)} aria-describedby={fieldErrors.cityOrZip ? "cityOrZip-error" : undefined} />
              {fieldErrors.cityOrZip && <span id="cityOrZip-error" className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.cityOrZip}</span>}
            </label>

            <label className={LABEL_CLASS}>
              Project Type *
              <select className={FIELD_CLASS} name="projectType" required defaultValue="" aria-invalid={Boolean(fieldErrors.projectType)} aria-describedby={fieldErrors.projectType ? "projectType-error" : undefined}>
                <option value="" disabled>
                  Select project type
                </option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {fieldErrors.projectType && <span id="projectType-error" className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.projectType}</span>}
            </label>

            <label className={LABEL_CLASS}>
              Preferred Contact Method *
              <select className={FIELD_CLASS} name="preferredContactMethod" required defaultValue="" aria-invalid={Boolean(fieldErrors.preferredContactMethod)} aria-describedby={fieldErrors.preferredContactMethod ? "preferredContactMethod-error" : undefined}>
                <option value="" disabled>
                  Select contact method
                </option>
                {CONTACT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {fieldErrors.preferredContactMethod && <span id="preferredContactMethod-error" className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.preferredContactMethod}</span>}
            </label>

            <label className={`${LABEL_CLASS} sm:col-span-2`}>
              Preferred Estimate Timing
              <select className={FIELD_CLASS} name="preferredEstimateTiming" defaultValue="" aria-invalid={Boolean(fieldErrors.preferredEstimateTiming)} aria-describedby={fieldErrors.preferredEstimateTiming ? "preferredEstimateTiming-error" : undefined}>
                <option value="">No preference</option>
                {ESTIMATE_TIMINGS.map((timing) => (
                  <option key={timing} value={timing}>
                    {timing}
                  </option>
                ))}
              </select>
              {fieldErrors.preferredEstimateTiming && <span id="preferredEstimateTiming-error" className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.preferredEstimateTiming}</span>}
            </label>

            <label className={`${LABEL_CLASS} sm:col-span-2`}>
              Tell Us About Your Project *
              <textarea
                className={`${FIELD_CLASS} min-h-36 resize-y leading-6`}
                name="projectDetails"
                minLength={20}
                maxLength={1600}
                placeholder="Tell us what you want built, repaired, cleaned up, or transformed."
                required
                aria-invalid={Boolean(fieldErrors.projectDetails)}
                aria-describedby={fieldErrors.projectDetails ? "projectDetails-error" : undefined}
              />
              {fieldErrors.projectDetails && <span id="projectDetails-error" className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.projectDetails}</span>}
            </label>
          </div>

          <label className="mt-6 flex gap-3 text-sm font-semibold leading-6 text-charcoal/72">
            <input name="consent" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-moss" />
            <span>
              I agree that D&G Landscape and Masonry Inc. may contact me by phone, text message or email regarding my estimate request. Message and data rates may apply.
              <Link href={getPrivacyPolicyUrl()} className="ml-1 font-black text-moss underline underline-offset-4">
                Privacy Policy
              </Link>
            </span>
          </label>
          {fieldErrors.consent && <span className="mt-2 block text-xs font-bold text-red-700">{fieldErrors.consent}</span>}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          {state === "success" && (
            <div className="mt-5 rounded-xl border border-moss/20 bg-moss/10 px-4 py-3 text-sm font-semibold text-moss" role="status" aria-live="polite">
              Request received. Redirecting to confirmation...
            </div>
          )}

          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-7 w-full rounded-full bg-gold px-8 py-4 text-base font-black text-ink shadow-[0_18px_45px_rgba(210,185,128,0.22)] transition hover:-translate-y-0.5 hover:bg-moss hover:text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {state === "sending" ? "Sending Your Request..." : "Request My Free Estimate"}
          </button>
        </form>
      </div>
    </section>
  );
}
