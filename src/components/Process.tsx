"use client";

import { useStaggerReveal } from "@/hooks/useGsapAnimations";

const steps = [
    {
        number: "01",
        title: "Request a Quote",
        description:
            "Call, text, or email us. Tell us about your property and what you envision—we'll schedule a time to meet.",
    },
    {
        number: "02",
        title: "On-Site Visit & Plan",
        description:
            "We visit your property in person, assess the scope, and build a detailed plan with honest, transparent pricing.",
    },
    {
        number: "03",
        title: "Build, Transform & Maintain",
        description:
            "Our crew brings your vision to life with expert craftsmanship—then offers ongoing maintenance to keep it at its best.",
    },
];

export default function Process() {
    useStaggerReveal("#process-steps", ".process-step");

    return (
        <section id="process" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-5xl px-6">
                {/* Section Header */}
                <div className="reveal-element mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-brown">
                        Process
                    </span>
                    <h2 className="font-heading text-4xl font-bold text-charcoal sm:text-5xl">
                        How It Works
                    </h2>
                    <div className="mx-auto mt-4 h-px w-16 bg-brown" />
                </div>

                {/* Steps */}
                <div id="process-steps" className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 hidden w-px bg-border sm:block" />

                    <div className="space-y-12 sm:space-y-16">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="process-step group relative flex gap-6 sm:gap-10"
                            >
                                {/* Number */}
                                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-border bg-white font-heading text-xl font-bold text-brown transition-all duration-500 group-hover:border-brown group-hover:bg-brown group-hover:text-white">
                                    {step.number}
                                </div>

                                {/* Content */}
                                <div className="pt-3">
                                    <h3 className="font-heading text-2xl font-semibold text-charcoal">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 max-w-lg text-neutral leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partnership note */}
                <div className="reveal-element mt-16 rounded-2xl border border-border bg-offwhite p-8 text-center shadow-sm">
                    <p className="text-neutral leading-relaxed">
                        Every project is a partnership—we focus on what you want, built to
                        be safe and structurally sound.
                    </p>
                </div>

                {/* About D&G */}
                <div className="reveal-element mt-8 rounded-2xl border border-brown/10 bg-soft-green/10 p-8 sm:p-10">
                    <h3 className="font-heading text-2xl font-semibold text-charcoal">
                        About D&amp;G
                    </h3>
                    <p className="mt-4 leading-relaxed text-neutral">
                        Founded in 2010 by Elmer Gomez, D&amp;G Landscaping and Masonry has
                        grown from a one-person operation into a trusted team of field
                        professionals. With over a decade of hands-on experience across
                        landscape maintenance, renovation, seeding, transplanting, pruning,
                        and masonry construction, we bring deep expertise to every project.
                        Our philosophy is simple: deliver what the customer dreams of—as long
                        as it&rsquo;s safe and structurally sound.
                    </p>
                </div>
            </div>
        </section>
    );
}
