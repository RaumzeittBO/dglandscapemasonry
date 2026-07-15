"use client";

import { useScrollReveal } from "@/hooks/useGsapAnimations";
import { siteConfig, getCallUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";

export default function BookingCTA() {
    useScrollReveal(".reveal-booking");

    return (
        <section className="bg-white py-24 sm:py-32 border-t border-border">
            <div className="mx-auto max-w-4xl px-6 text-center reveal-booking">
                <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brown/70">
                    Schedule an Estimate
                </span>
                <h2 className="mb-6 font-heading text-4xl font-bold text-charcoal sm:text-5xl">
                    Get a Clear Plan &amp; Quote
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral">
                    Book a quick site visit with our team, and let&rsquo;s discuss how to bring your outdoor space to life.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    {siteConfig.primaryEmail && (
                        <a
                            href={`mailto:${siteConfig.primaryEmail}`}
                            onClick={reportConversion}
                            className="inline-flex items-center gap-2 rounded-full bg-brown px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-brown-light hover:shadow-lg hover:shadow-brown/20 hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            Email Us for a Quote
                        </a>
                    )}

                    <span className="text-sm font-medium text-neutral-light">or</span>

                    <a
                        href={getCallUrl()}
                        onClick={reportConversion}
                        className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-8 py-4 text-base font-semibold text-charcoal transition-all duration-300 hover:bg-offwhite hover:border-charcoal/40 hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Call / Text
                    </a>
                </div>
            </div>
        </section>
    );
}
