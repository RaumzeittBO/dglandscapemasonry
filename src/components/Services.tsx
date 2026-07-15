"use client";

import type { CSSProperties } from "react";
import { useStaggerReveal } from "@/hooks/useGsapAnimations";

const services = [
    {
        title: "Landscape Renovation",
        description:
            "Planting, grading, edging, cleanup, lawn repair, and seasonal refreshes that make a property feel cared for immediately.",
        meta: "Design + maintenance",
    },
    {
        title: "Hardscape Construction",
        description:
            "Patios, walkways, retaining walls, pavers, stone details, and masonry work built for structure, drainage, and long-term use.",
        meta: "Stone + pavers",
    },
    {
        title: "Sod Installation",
        description:
            "Instant green lawns with proper prep, clean seams, and a finish that changes curb appeal in a single day.",
        meta: "Fast curb appeal",
    },
    {
        title: "Patios & Outdoor Living",
        description:
            "Outdoor rooms for hosting, relaxing, and adding usable square footage around the home.",
        meta: "Built to gather",
    },
    {
        title: "Walkways & Entries",
        description:
            "Safer, sharper entrances with stone, brick, or concrete paths that frame the home from the first step.",
        meta: "First impression",
    },
    {
        title: "Borders, Fencing & Detail Work",
        description:
            "Finishing touches that organize beds, define space, and make the whole project feel intentional.",
        meta: "Finish details",
    },
];

const deliverables = [
    "Clear estimate before work starts",
    "On-site walkthrough and practical plan",
    "Crew-led execution with clean closeout",
];

export default function Services() {
    useStaggerReveal("#services-grid", ".service-card", { stagger: 0.08, y: 36 });

    return (
        <section id="services" className="bg-mist py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-end">
                    <div className="reveal-element">
                        <span className="mb-5 inline-flex rounded-full bg-sage/18 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-moss">
                            Services
                        </span>
                        <h2 className="font-heading text-5xl font-bold leading-[0.95] text-charcoal sm:text-6xl">
                            High-impact exterior work, handled end to end.
                        </h2>
                    </div>
                    <div className="reveal-element max-w-2xl lg:ml-auto">
                        <p className="text-lg leading-8 text-charcoal/68">
                            Homeowners hire D&G when they want the outside of the property to feel more finished, more usable, and more valuable without chasing multiple crews.
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {deliverables.map((item) => (
                                <div key={item} className="rounded-2xl border border-charcoal/8 bg-white/70 p-4 text-sm font-bold text-charcoal/72 shadow-sm">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div id="services-grid" className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, idx) => (
                        <article
                            key={service.title}
                            className="service-card group relative min-h-[270px] overflow-hidden rounded-[1.5rem] border border-charcoal/8 bg-white p-7 shadow-[0_18px_55px_rgba(23,35,27,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-moss/25 hover:shadow-[0_28px_80px_rgba(38,74,55,0.16)]"
                            style={{ "--service-delay": `${idx * 70}ms` } as CSSProperties}
                        >
                            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sage/18 transition-transform duration-500 group-hover:scale-125" />
                            <div className="relative">
                                <div className="mb-10 flex items-center justify-between">
                                    <span className="rounded-full bg-mist px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-moss">
                                        {service.meta}
                                    </span>
                                    <span className="font-heading text-5xl font-bold text-charcoal/10">
                                        {String(idx + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <h3 className="font-heading text-2xl font-bold leading-tight text-charcoal">
                                    {service.title}
                                </h3>
                                <p className="mt-4 text-sm leading-7 text-charcoal/62">
                                    {service.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
