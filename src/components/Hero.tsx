"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";

const heroImages = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
    "/images/hero-4.jpg",
];

const metrics = [
    { value: "2010", label: "Founded" },
    { value: "5.0", label: "Google rating" },
    { value: "12%", label: "New customer offer" },
];

const proofPoints = [
    "Patios, walkways, retaining walls",
    "Landscape renovations and maintenance",
    "Residential and commercial crews",
];

const INTERVAL = 5200;
const FADE_DURATION = 1200;

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const imageFrameRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState<number | null>(null);

    const advance = useCallback(() => {
        const next = (currentIndex + 1) % heroImages.length;
        setNextIndex(next);
        window.setTimeout(() => {
            setCurrentIndex(next);
            setNextIndex(null);
        }, FADE_DURATION);
    }, [currentIndex]);

    useEffect(() => {
        const timer = window.setInterval(advance, INTERVAL);
        return () => window.clearInterval(timer);
    }, [advance]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-reveal",
                { opacity: 0, y: 34, filter: "blur(10px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "power3.out",
                    stagger: 0.09,
                }
            );

            gsap.fromTo(
                ".hero-image-lift",
                { opacity: 0, y: 44, scale: 0.96, rotate: -1.5 },
                { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.25, ease: "power3.out", delay: 0.18 }
            );

            gsap.to(".floating-proof", {
                y: -10,
                duration: 2.8,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                stagger: 0.25,
            });
        }, heroRef);

        const handlePointerMove = (event: PointerEvent) => {
            if (!imageFrameRef.current) return;
            const rect = imageFrameRef.current.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            gsap.to(imageFrameRef.current, {
                rotateY: x * 5,
                rotateX: y * -5,
                transformPerspective: 900,
                duration: 0.7,
                ease: "power2.out",
            });
        };

        const handlePointerLeave = () => {
            if (!imageFrameRef.current) return;
            gsap.to(imageFrameRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power2.out" });
        };

        const frame = imageFrameRef.current;
        frame?.addEventListener("pointermove", handlePointerMove);
        frame?.addEventListener("pointerleave", handlePointerLeave);

        return () => {
            frame?.removeEventListener("pointermove", handlePointerMove);
            frame?.removeEventListener("pointerleave", handlePointerLeave);
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative isolate min-h-screen overflow-hidden bg-ink pt-28 text-white sm:pt-32"
        >
            <div className="absolute inset-0 -z-20">
                <Image
                    src={heroImages[currentIndex]}
                    alt="Finished landscape and masonry project"
                    fill
                    priority
                    className="scale-105 object-cover opacity-58"
                    sizes="100vw"
                />
                {nextIndex !== null && (
                    <Image
                        src={heroImages[nextIndex]}
                        alt="Finished landscape and masonry project"
                        fill
                        className="scale-105 animate-hero-fade object-cover opacity-58"
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,10,0.96)_0%,rgba(8,13,10,0.78)_43%,rgba(8,13,10,0.36)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(210,185,128,0.22),transparent_34%),radial-gradient(circle_at_18%_82%,rgba(114,148,111,0.18),transparent_34%)]" />
            </div>

            <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 px-6 pb-14 lg:grid-cols-[1.02fr_0.98fr] lg:pb-16">
                <div className="max-w-3xl">
                    <div className="hero-reveal mb-6 inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/82 backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-sage shadow-[0_0_22px_rgba(166,196,147,0.9)]" />
                        Greater Boston outdoor transformations
                    </div>

                    <h1 className="hero-reveal font-heading text-[clamp(2.65rem,5.5vw,5.25rem)] font-bold leading-[0.94] tracking-normal">
                        Landscapes that make the whole property feel expensive.
                    </h1>

                    <p className="hero-reveal mt-5 max-w-2xl text-base leading-7 text-white/74 sm:text-lg">
                        D&G Landscape and Masonry Inc. builds patios, stonework, lawns, and full outdoor upgrades with the kind of finish that makes people stop at the curb.
                    </p>

                    <div className="hero-reveal mt-7 flex flex-col gap-3 sm:flex-row">
                        <a
                            href={getCallUrl()}
                            onClick={reportConversion}
                            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold px-7 py-4 text-base font-black text-ink shadow-[0_22px_50px_rgba(210,185,128,0.24)] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                        >
                            Get a fast estimate
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </a>
                        {siteConfig.primaryEmail && (
                            <a
                                href={getEmailUrl()}
                                onClick={reportConversion}
                                className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/18"
                            >
                                Send project details
                            </a>
                        )}
                    </div>

                    <div className="hero-reveal mt-7 grid max-w-2xl grid-cols-3 overflow-hidden rounded-3xl border border-white/14 bg-white/[0.08] backdrop-blur-xl">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="border-r border-white/12 px-4 py-5 last:border-r-0 sm:px-6">
                                <div className="font-heading text-3xl font-bold text-white">{metric.value}</div>
                                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/54">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero-image-lift relative hidden min-h-[560px] lg:block">
                    <div
                        ref={imageFrameRef}
                        className="absolute right-0 top-4 h-[520px] w-[82%] overflow-hidden rounded-[2rem] border border-white/16 bg-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
                    >
                        <Image
                            src="/projects/project-01/after.jpg"
                            alt="Completed patio and landscape project"
                            fill
                            priority
                            className="object-cover"
                            sizes="42vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/72 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/16 bg-ink/68 p-5 backdrop-blur-xl">
                            <div className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Featured finish</div>
                            <p className="mt-2 font-heading text-2xl font-semibold text-white">
                                Clean hardscape, sharp edges, ready for everyday living.
                            </p>
                        </div>
                    </div>

                    <div className="floating-proof absolute left-1 top-28 w-64 rounded-3xl border border-white/14 bg-white/92 p-5 text-ink shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-moss">What we handle</div>
                        <div className="mt-4 space-y-3">
                            {proofPoints.map((point) => (
                                <div key={point} className="flex items-start gap-3 text-sm font-semibold text-charcoal/78">
                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sage" />
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="floating-proof absolute bottom-12 left-14 rounded-3xl border border-gold/30 bg-gold p-5 text-ink shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
                        <div className="font-heading text-5xl font-black leading-none">12%</div>
                        <div className="mt-1 text-sm font-black uppercase tracking-[0.14em]">Off new customers</div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/40 md:flex">
                <span className="h-px w-12 bg-white/20" />
                Scroll
                <span className="h-px w-12 bg-white/20" />
            </div>
        </section>
    );
}
