"use client";

import { useStaggerReveal } from "@/hooks/useGsapAnimations";

const services = [
    {
        title: "Landscaping Services",
        description:
            "Complete landscape design, planting, mowing, seeding, and aesthetic upgrades that transform your property into a stunning outdoor space.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 20h10" />
                <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
            </svg>
        ),
    },
    {
        title: "Hardscape Construction",
        description:
            "Custom patios, walkways, retaining walls, pavers, and stonework—built for durability and clean design.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="6" width="22" height="4" />
                <rect x="1" y="14" width="22" height="4" />
                <line x1="12" y1="6" x2="12" y2="10" />
                <line x1="7" y1="14" x2="7" y2="18" />
                <line x1="17" y1="14" x2="17" y2="18" />
            </svg>
        ),
    },
    {
        title: "Sod Installation",
        description:
            "High-quality sod installation for an instant, healthy lawn and improved curb appeal.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V8" />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
                <path d="M8 2h8l-4 6-4-6z" />
            </svg>
        ),
    },
    {
        title: "Patios",
        description:
            "Custom-built patios designed for outdoor living. Stone, pavers, or concrete—crafted to complement your home and lifestyle.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        title: "Walkways",
        description:
            "Elegant stone, brick, and concrete walkways and entry upgrades—precision-laid for beauty, safety, and lasting first impressions.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
    },
    {
        title: "Fencing & Borders",
        description:
            "Professional fencing and bender board edging for clean property lines, structure, and a polished, finished landscape.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="2" x2="4" y2="22" />
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="20" y1="2" x2="20" y2="22" />
                <line x1="4" y1="8" x2="12" y2="8" />
                <line x1="12" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="12" y2="16" />
                <line x1="12" y1="16" x2="20" y2="16" />
            </svg>
        ),
    },
];

export default function Services() {
    useStaggerReveal("#services-grid", ".service-card");

    return (
        <section id="services" className="bg-offwhite py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="reveal-element mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-brown">
                        Our Services
                    </span>
                    <h2 className="font-heading text-4xl font-bold text-charcoal sm:text-5xl">
                        Craftsmanship You Can Trust
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral">
                        Residential &amp; Commercial Projects
                    </p>
                    <div className="mx-auto mt-6 h-px w-16 bg-brown" />
                </div>

                {/* Grid */}
                <div
                    id="services-grid"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            className="service-card group cursor-default rounded-2xl border border-border bg-white p-8 shadow-sm transition-all duration-500 hover:border-brown/20 hover:shadow-lg hover:shadow-brown/5 hover:-translate-y-1"
                        >
                            <div className="mb-6 inline-flex rounded-xl bg-soft-green/30 p-3 text-brown transition-colors duration-300 group-hover:bg-brown/10">
                                {service.icon}
                            </div>
                            <h3 className="mb-3 font-heading text-xl font-semibold text-charcoal">
                                {service.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-neutral">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Who We Serve */}
                <div className="reveal-element mt-24 rounded-3xl bg-white p-10 text-center shadow-sm sm:p-16">
                    <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brown/70">
                        Ideal Client
                    </span>
                    <h3 className="mb-4 font-heading text-3xl font-bold text-charcoal">
                        Who We Serve
                    </h3>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral">
                        Homeowners and businesses looking for high-quality outdoor upgrades,
                        long-term maintenance, and reliable craftsmanship.
                    </p>
                </div>
            </div>
        </section>
    );
}
