"use client";

import { useStaggerReveal } from "@/hooks/useGsapAnimations";

const steps = [
    {
        number: "01",
        title: "Request a Quote",
        description:
            "Call, text, or email us. Tell us about your property and what you envision. We'll schedule a time to meet.",
    },
    {
        number: "02",
        title: "On-Site Visit & Plan",
        description:
            "We visit your property in person, assess the scope, and build a practical plan with honest, transparent pricing.",
    },
    {
        number: "03",
        title: "Build, Transform & Maintain",
        description:
            "Our crew brings your vision to life with expert craftsmanship, then offers ongoing maintenance to keep it at its best.",
    },
];

export default function Process() {
    useStaggerReveal("#process-steps", ".process-step", { stagger: 0.12, y: 30 });

    return (
        <section id="process" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="reveal-element mb-16 text-center">
                    <span className="mb-5 inline-flex rounded-full bg-mist px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-moss">
                        Process
                    </span>
                    <h2 className="mx-auto max-w-4xl font-heading text-5xl font-bold leading-[0.98] text-charcoal sm:text-6xl">
                        A clean process from first call to final sweep.
                    </h2>
                </div>

                <div id="process-steps" className="grid gap-4 md:grid-cols-3">
                    {steps.map((step) => (
                        <article
                            key={step.number}
                            className="process-step rounded-[1.5rem] border border-charcoal/8 bg-mist p-7 shadow-[0_18px_55px_rgba(23,35,27,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-moss/20 hover:bg-white"
                        >
                            <div className="font-heading text-6xl font-bold text-moss/18">{step.number}</div>
                            <h3 className="mt-10 font-heading text-2xl font-bold text-charcoal">
                                {step.title}
                            </h3>
                            <p className="mt-4 text-sm leading-7 text-charcoal/62">
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>

                <div className="reveal-element mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="rounded-[1.5rem] border border-moss/10 bg-moss p-8 text-white">
                        <div className="text-xs font-black uppercase tracking-[0.18em] text-sage">Our standard</div>
                        <p className="mt-4 font-heading text-3xl font-semibold leading-tight">
                            Dream big, then build it safely and structurally sound.
                        </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-charcoal/8 bg-mist p-8 sm:p-10">
                        <h3 className="font-heading text-2xl font-bold text-charcoal">About D&G</h3>
                        <p className="mt-4 leading-8 text-charcoal/64">
                            Founded in 2010 by Elmer Gomez, D&G Landscaping and Masonry has grown from a one-person operation into a trusted field team. With over a decade of hands-on experience across landscape maintenance, renovation, seeding, transplanting, pruning, and masonry construction, we bring practical expertise to every project.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
