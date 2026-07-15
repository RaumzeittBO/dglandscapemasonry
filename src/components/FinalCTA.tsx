"use client";

import { useEffect, useRef } from "react";
import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FinalCTA() {
    const headlineRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (headlineRef.current) {
                gsap.fromTo(
                    headlineRef.current,
                    { opacity: 0, y: 40, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: headlineRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* Final CTA */}
            <section
                id="final-cta"
                className="relative overflow-hidden bg-charcoal py-24 sm:py-32"
            >
                {/* Subtle pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #7A5A3A 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <div className="mb-8 mx-auto h-px w-16 bg-brown" />

                    <h2
                        ref={headlineRef}
                        className="font-heading text-4xl font-bold text-white sm:text-5xl md:text-6xl"
                    >
                        Ready to upgrade your
                        <br />
                        <span className="text-brown-light">outdoor space?</span>
                    </h2>

                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-brown/40 bg-white/95 px-6 py-3 shadow-xl backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#20bd5a]" />
                            </span>
                            <span className="font-heading text-xl font-extrabold text-charcoal tracking-tight">12% OFF</span>
                            <span className="font-heading text-base font-bold text-brown">for New Customers</span>
                        </div>
                    </div>

                    <p className="mt-6 text-lg text-neutral-light">
                        Let&rsquo;s create something extraordinary together.
                    </p>

                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        {siteConfig.primaryEmail && (
                            <a
                                href={getEmailUrl()}
                                onClick={reportConversion}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-charcoal transition-all duration-300 hover:bg-offwhite hover:shadow-lg hover:shadow-white/20 hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Email Us for a Quote
                            </a>
                        )}
                        <a
                            href={getCallUrl()}
                            onClick={reportConversion}
                            className="inline-flex items-center gap-2 rounded-full bg-brown px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-brown-light hover:shadow-lg hover:shadow-brown/20 hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            Call / Text {siteConfig.phoneDisplay}
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {/* Company */}
                        <div>
                            <h3 className="font-heading text-xl font-bold text-brown">
                                {siteConfig.companyName}
                            </h3>
                            <p className="mt-2 text-sm text-neutral">
                                Premium landscaping and masonry for residential
                                and commercial properties.
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal/50">
                                Contact
                            </h4>
                            <div className="space-y-2 text-sm text-neutral">
                                <a
                                    href={getCallUrl()}
                                    className="flex items-center gap-2 transition-colors hover:text-brown"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    {siteConfig.phoneDisplay}
                                </a>
                                <a
                                    href={`mailto:${siteConfig.primaryEmail}`}
                                    className="flex items-center gap-2 transition-colors hover:text-brown"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                    {siteConfig.primaryEmail}
                                </a>
                            </div>
                        </div>

                        {/* Service Areas */}
                        <div>
                            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal/50">
                                Service Areas
                            </h4>
                            <p className="text-sm text-neutral">
                                {siteConfig.serviceAreas.slice(0, 5).join(" · ")} &amp; more
                            </p>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-12 border-t border-border pt-8 text-center">
                        <p className="text-xs text-neutral-light">
                            &copy; {currentYear} {siteConfig.companyName}. All Rights
                            Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
