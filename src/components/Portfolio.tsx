"use client";

import BeforeAfterSlider from "./BeforeAfterSlider";
import { projects } from "@/data/projects";
import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";
import { useStaggerReveal } from "@/hooks/useGsapAnimations";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { transformations } from "@/data/transformations";

export default function Portfolio() {
    useStaggerReveal("#portfolio-grid", ".portfolio-card");
    const [filter, setFilter] = useState("All");

    const filters = ["All", "Landscaping", "Hardscape"];
    const filteredTransformations = filter === "All" ? transformations : transformations.filter(t => t.category === filter);

    return (
        <section id="portfolio" className="bg-charcoal py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="reveal-element mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-brown-light">
                        Portfolio
                    </span>
                    <h2 className="font-heading text-4xl font-bold text-white sm:text-5xl">
                        Featured Before &amp; After
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-neutral-light">
                        Small changes to full makeovers—see the difference detail and
                        craftsmanship make.
                    </p>
                    <div className="mx-auto mt-4 h-px w-16 bg-brown" />
                </div>

                {/* Grid */}
                <div
                    id="portfolio-grid"
                    className="grid grid-cols-1 gap-8 md:grid-cols-2"
                >
                    {projects.slice(0, 6).map((project) => (
                        <div
                            key={project.id}
                            className="portfolio-card group overflow-hidden rounded-2xl border border-white/5 bg-charcoal-light p-3 transition-all duration-500 hover:border-brown/20"
                        >
                            <BeforeAfterSlider
                                beforeSrc={project.beforeSrc}
                                afterSrc={project.afterSrc}
                                beforeAlt={`Project ${project.id} - Before`}
                                afterAlt={`Project ${project.id} - After`}
                            />
                            {/* Minimal label only — titles hidden until confirmed */}
                            <div className="mt-3 flex items-center justify-center gap-4 px-1">
                                <span className="rounded-full bg-soft-green/20 px-3 py-1 text-xs font-medium text-soft-green">
                                    Before / After
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center reveal-element">
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-2 rounded-full border border-brown px-8 py-3.5 font-semibold text-brown transition-all duration-300 hover:bg-brown hover:text-white hover:scale-105"
                    >
                        View Full Photo Gallery
                    </Link>
                </div>

                {/* More Transformations */}
                <div className="mt-32">
                    <div className="reveal-element mb-12 text-center">
                        <h3 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                            More Transformations
                        </h3>
                        <p className="mx-auto mt-4 max-w-2xl text-neutral-light">
                            Explore our recent projects and completed work.
                        </p>

                        {/* Filter Bar */}
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {filters.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${filter === f
                                        ? "bg-brown text-white shadow-lg shadow-brown/20"
                                        : "bg-charcoal-light text-neutral-light hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {filteredTransformations.map((item, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-xl bg-charcoal-light border border-white/5 overflow-hidden group relative"
                            >
                                <Image
                                    src={item.src}
                                    alt={`${item.category} transformation ${i + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center reveal-element">
                        <Link
                            href="/gallery"
                            className="inline-flex items-center gap-2 rounded-full border border-brown px-8 py-3.5 font-semibold text-brown transition-all duration-300 hover:bg-brown hover:text-white hover:scale-105"
                        >
                            View Full Photo Gallery
                        </Link>
                    </div>
                </div>

                {/* CTA Strip */}
                <div className="reveal-element mt-16 rounded-2xl border border-brown/20 bg-charcoal-light p-8 text-center sm:p-12">
                    <p className="font-heading text-2xl font-semibold text-white sm:text-3xl">
                        Want results like these?
                    </p>
                    <p className="mt-2 text-lg text-brown-light">
                        Call/Text {siteConfig.phoneDisplay}
                    </p>
                    <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        {siteConfig.primaryEmail && (
                            <a
                                href={getEmailUrl()}
                                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-charcoal-light hover:shadow-lg hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Email Us
                            </a>
                        )}
                        <a
                            href={getCallUrl()}
                            className="inline-flex items-center gap-2 rounded-full bg-brown px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-brown-light hover:shadow-lg hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            Call Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
