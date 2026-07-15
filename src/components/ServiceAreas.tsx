"use client";

import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";
import { useStaggerReveal } from "@/hooks/useGsapAnimations";

export default function ServiceAreas() {
    useStaggerReveal("#areas-grid", ".area-item");

    return (
        <section id="service-areas" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-5xl px-6">
                {/* Section Header */}
                <div className="reveal-element mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-brown">
                        Coverage
                    </span>
                    <h2 className="font-heading text-4xl font-bold text-charcoal sm:text-5xl">
                        Service Areas
                    </h2>
                    <div className="mx-auto mt-4 h-px w-16 bg-brown" />
                </div>

                {/* Cities Grid */}
                <div
                    id="areas-grid"
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
                >
                    {siteConfig.serviceAreas.map((area, idx) => (
                        <div
                            key={idx}
                            className="area-item flex items-center gap-2 rounded-xl border border-border bg-offwhite p-4 text-sm font-medium text-charcoal shadow-sm transition-all duration-300 hover:border-brown/20 hover:shadow-md"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 shrink-0 text-brown"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {area}
                        </div>
                    ))}
                </div>

                {/* Not listed */}
                <div className="reveal-element mt-12 rounded-2xl border border-border bg-offwhite p-8 text-center shadow-sm">
                    <p className="text-neutral">
                        Not listed?{" "}
                        <span className="font-medium text-charcoal">Call/Text us</span> — we
                        may still serve your area.
                    </p>
                    <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <a
                            href={getEmailUrl()}
                            className="inline-flex items-center gap-2 rounded-full bg-brown px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-brown-light hover:shadow-lg hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            Email Us for a Quote
                        </a>
                        <a
                            href={getCallUrl()}
                            className="inline-flex items-center gap-2 rounded-full border border-brown/20 px-6 py-3 text-sm font-semibold text-brown transition-all duration-300 hover:bg-brown/5 hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            Call / Text
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
