"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { projects } from "@/data/projects";
import { transformations } from "@/data/transformations";
import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";
import { useStaggerReveal } from "@/hooks/useGsapAnimations";

export default function Portfolio() {
    useStaggerReveal("#portfolio-grid", ".portfolio-card", { stagger: 0.08, y: 34 });
    const [filter, setFilter] = useState("All");

    const filters = ["All", "Landscaping", "Hardscape"];
    const filteredTransformations =
        filter === "All"
            ? transformations
            : transformations.filter((item) => item.category === filter);

    return (
        <section id="portfolio" className="bg-ink py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="reveal-element mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div>
                        <span className="mb-5 inline-flex rounded-full bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gold">
                            Proof of work
                        </span>
                        <h2 className="font-heading text-5xl font-bold leading-[0.96] text-white sm:text-6xl">
                            Before and after that sells the job for us.
                        </h2>
                    </div>
                    <p className="max-w-2xl text-lg leading-8 text-white/62 lg:ml-auto">
                        Real D&G projects, real materials, and visible transformation. Drag each image to compare the difference detail and craftsmanship make.
                    </p>
                </div>

                <div id="portfolio-grid" className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {projects.slice(0, 6).map((project) => (
                        <article
                            key={project.id}
                            className="portfolio-card group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/35"
                        >
                            <BeforeAfterSlider
                                beforeSrc={project.beforeSrc}
                                afterSrc={project.afterSrc}
                                beforeAlt={`Project ${project.id} before`}
                                afterAlt={`Project ${project.id} after`}
                            />
                            <div className="mt-4 flex items-center justify-between px-2 pb-1">
                                <span className="rounded-full bg-sage/16 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sage">
                                    Before / After
                                </span>
                                <span className="text-sm font-semibold text-white/48">
                                    Project {String(project.id).padStart(2, "0")}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 text-center reveal-element">
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-2 rounded-full border border-gold px-8 py-3.5 font-bold text-gold transition-all duration-300 hover:-translate-y-1 hover:bg-gold hover:text-ink"
                    >
                        View Full Photo Gallery
                    </Link>
                </div>

                <div className="mt-32">
                    <div className="reveal-element mb-12 text-center">
                        <h3 className="font-heading text-4xl font-bold text-white sm:text-5xl">
                            More transformations
                        </h3>
                        <p className="mx-auto mt-4 max-w-2xl text-white/58">
                            Explore recent landscape and hardscape work from the crew.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {filters.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setFilter(item)}
                                    className={`rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
                                        filter === item
                                            ? "bg-gold text-ink shadow-lg shadow-gold/20"
                                            : "bg-white/8 text-white/58 hover:bg-white/14 hover:text-white"
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {filteredTransformations.map((item, index) => (
                            <div
                                key={`${item.src}-${index}`}
                                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/8"
                            >
                                <Image
                                    src={item.src}
                                    alt={`${item.category} transformation ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/44 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="reveal-element mt-16 rounded-[1.5rem] border border-gold/20 bg-white/[0.06] p-8 text-center sm:p-12">
                    <p className="font-heading text-3xl font-semibold text-white sm:text-4xl">
                        Want results like these?
                    </p>
                    <p className="mt-2 text-lg text-gold">Call/Text {siteConfig.phoneDisplay}</p>
                    <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        {siteConfig.primaryEmail && (
                            <a
                                href={getEmailUrl()}
                                onClick={reportConversion}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-ink transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                Email Us
                            </a>
                        )}
                        <a
                            href={getCallUrl()}
                            onClick={reportConversion}
                            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-black text-ink transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                        >
                            Call Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
