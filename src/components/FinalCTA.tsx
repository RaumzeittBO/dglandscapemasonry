"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";

export default function FinalCTA() {
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headlineRef.current,
                { opacity: 0, y: 32, filter: "blur(8px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headlineRef.current,
                        start: "top 82%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <section id="final-cta" className="relative isolate overflow-hidden bg-ink px-6 py-24 text-white sm:py-32">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_15%,rgba(210,185,128,0.16),transparent_32%),radial-gradient(circle_at_80%_74%,rgba(114,148,111,0.18),transparent_36%)]" />

                <div className="mx-auto max-w-5xl text-center">
                    <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gold">
                        Ready when you are
                    </span>
                    <h2 ref={headlineRef} className="mt-6 font-heading text-5xl font-bold leading-[0.96] sm:text-7xl">
                        Make the outside of your property the reason people stop looking.
                    </h2>
                    <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/68">
                        New customers can ask about the current 12% offer during the estimate.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        {siteConfig.primaryEmail && (
                            <a
                                href={getEmailUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={reportConversion}
                                className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 text-base font-black text-ink transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                            >
                                Email for a free quote
                            </a>
                        )}
                        <a
                            href={getCallUrl()}
                            onClick={reportConversion}
                            className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/18"
                        >
                            Call/Text {siteConfig.phoneDisplay}
                        </a>
                    </div>
                </div>
            </section>

            <footer className="border-t border-charcoal/8 bg-white py-12 sm:py-16">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-[1.2fr_0.8fr_1fr]">
                    <div>
                        <h3 className="font-heading text-2xl font-bold text-charcoal">{siteConfig.companyName}</h3>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-charcoal/62">
                            Premium landscaping and masonry for residential and commercial properties across our Massachusetts service areas.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.18em] text-moss">Contact</h4>
                        <div className="mt-4 space-y-2 text-sm font-semibold text-charcoal/70">
                            <a href={getCallUrl()} className="block hover:text-moss">{siteConfig.phoneDisplay}</a>
                            <a
                                href={getEmailUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={reportConversion}
                                className="block hover:text-moss"
                            >
                                {siteConfig.primaryEmail}
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.18em] text-moss">Service Areas</h4>
                        <p className="mt-4 text-sm leading-6 text-charcoal/62">
                            {siteConfig.serviceAreas.slice(0, 6).join(" / ")} and nearby towns.
                        </p>
                    </div>
                </div>
                <div className="mx-auto mt-10 max-w-7xl px-6 text-xs font-semibold text-charcoal/42">
                    &copy; {currentYear} {siteConfig.companyName}. All Rights Reserved.
                </div>
            </footer>
        </>
    );
}
