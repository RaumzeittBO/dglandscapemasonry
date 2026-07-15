"use client";

import { useScrollReveal } from "@/hooks/useGsapAnimations";

export default function ServiceAreaText() {
    useScrollReveal(".reveal-element");

    return (
        <section id="service-areas-text" className="bg-charcoal py-24 sm:py-32 border-t border-white/5">
            <div className="mx-auto max-w-7xl px-6 text-center reveal-element">
                <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-brown-light">
                    Our Reach
                </span>
                <h2 className="font-heading text-4xl font-bold text-white sm:text-5xl">
                    We Come To You
                </h2>
                <div className="mx-auto mt-4 h-px w-16 bg-brown" />
                <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-light">
                    Residential & commercial landscaping and masonry services delivered directly to your property across our service areas.
                </p>
            </div>
        </section>
    );
}
