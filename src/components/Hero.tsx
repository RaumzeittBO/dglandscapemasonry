"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";
import { useHeroTextReveal } from "@/hooks/useGsapAnimations";
import gsap from "gsap";

const heroImages = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
    "/images/hero-4.jpg",
];

const INTERVAL = 5000; // 5 seconds between slides
const FADE_DURATION = 1200; // 1.2s crossfade

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState<number | null>(null);

    useHeroTextReveal("#hero-headline");

    // Auto-rotate images
    const advance = useCallback(() => {
        const next = (currentIndex + 1) % heroImages.length;
        setNextIndex(next);

        setTimeout(() => {
            setCurrentIndex(next);
            setNextIndex(null);
        }, FADE_DURATION);
    }, [currentIndex]);

    useEffect(() => {
        const timer = setInterval(advance, INTERVAL);
        return () => clearInterval(timer);
    }, [advance]);

    // Subtle parallax on desktop
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion || window.innerWidth < 768) return;

        const handleScroll = () => {
            if (bgRef.current) {
                const scrollY = window.scrollY;
                gsap.set(bgRef.current, {
                    y: scrollY * 0.3,
                });
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fade-in for subtitle and buttons, plus shimmer loop
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        const heroCtx = gsap.context(() => {
            gsap.fromTo(
                ".hero-fade-in",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    delay: 1.2,
                }
            );

            // Shimmer animation for promo card
            gsap.fromTo(".promo-shimmer",
                { x: "-100%" },
                {
                    x: "300%",
                    duration: 1.5,
                    ease: "power1.inOut",
                    repeat: -1,
                    repeatDelay: 6,
                    delay: 2.5
                }
            );
        }, heroRef);

        return () => heroCtx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
            {/* Background Images with Crossfade */}
            <div ref={bgRef} className="absolute inset-0 -top-20">
                {/* Current image (always visible) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    key={`current-${currentIndex}`}
                    src={heroImages[currentIndex]}
                    alt="D&G Landscaping and Masonry work"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ minHeight: "120%" }}
                    fetchPriority="high"
                />

                {/* Next image (fades in on top) */}
                {nextIndex !== null && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        key={`next-${nextIndex}`}
                        src={heroImages[nextIndex]}
                        alt="D&G Landscaping and Masonry work"
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{
                            minHeight: "120%",
                            animation: `heroFadeIn ${FADE_DURATION}ms ease-in-out forwards`,
                        }}
                    />
                )}

                {/* Dark overlay gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
            </div>

            {/* Inline keyframes */}
            <style jsx>{`
                @keyframes heroFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>

            {/* Content */}
            <div className="relative w-full z-10 mx-auto max-w-7xl px-6 py-32 text-center">
                {/* Logo with professional frosted glass container */}
                <div className="hero-fade-in mx-auto mb-8 flex justify-center items-center opacity-0 drop-shadow-lg">
                    <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 px-8 py-6 shadow-xl">
                        <Image
                            src="/logo/dg-logo.png"
                            alt="D&G Landscape and Masonry Inc."
                            width={320}
                            height={160}
                            className="mx-auto h-auto w-48 sm:w-56 md:w-64 lg:w-72"
                            priority
                        />
                    </div>
                </div>

                {/* Promo Card (Desktop) */}
                <div className="hidden lg:flex promo-card hero-fade-in absolute right-6 top-[30%] -translate-y-[30%] flex-col items-start gap-1 rounded-2xl border border-brown/40 bg-white/95 p-7 shadow-2xl backdrop-blur-xl max-w-sm opacity-0 text-left overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-brown/20 hover:border-brown z-20 cursor-default">
                    <div className="promo-shimmer absolute top-0 -left-[100%] h-full w-[100%] bg-gradient-to-r from-transparent via-white/90 to-transparent skew-x-12 z-0" />

                    <div className="relative z-10 flex flex-col">
                        <span className="font-heading text-5xl font-extrabold text-charcoal tracking-tight drop-shadow-sm">12% OFF</span>
                        <span className="font-heading text-2xl font-bold text-brown drop-shadow-sm">for New Customers</span>
                        <div className="mt-3 flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#20bd5a] opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#20bd5a]" />
                            </span>
                            <span className="text-sm font-semibold text-charcoal/70 uppercase tracking-wider">Limited-time offer</span>
                        </div>
                    </div>
                </div>


                <h1
                    id="hero-headline"
                    className="font-heading text-5xl font-bold leading-tight tracking-tight text-white opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
                    style={{ perspective: "600px" }}
                >
                    D&amp;G Landscape
                    <br />
                    <span className="text-white/90">and Masonry Inc.</span>
                </h1>

                <p className="hero-fade-in mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/80 opacity-0 sm:text-xl">
                    Residential &amp; Commercial landscape and masonry work, including hardscape construction and professional sod installation.
                </p>

                {/* Buttons */}
                <div className="hero-fade-in mt-10 flex flex-col items-center gap-4 opacity-0 sm:flex-row sm:justify-center">
                    {siteConfig.primaryEmail && (
                        <a
                            href={getEmailUrl()}
                            onClick={reportConversion}
                            className="inline-flex items-center gap-2 rounded-full bg-charcoal px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-charcoal-light hover:shadow-lg hover:shadow-charcoal/20 hover:scale-105"
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
                        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-charcoal transition-all duration-300 hover:bg-offwhite hover:shadow-lg hover:shadow-white/20 hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Call / Text
                    </a>
                </div>

                {/* Promo Card (Mobile) */}
                <div className="lg:hidden promo-card hero-fade-in mt-10 w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-brown/40 bg-white/95 p-6 shadow-2xl backdrop-blur-xl opacity-0 text-center transition-transform active:scale-95 relative z-20">
                    <div className="promo-shimmer absolute top-0 -left-[100%] h-full w-[100%] bg-gradient-to-r from-transparent via-white/90 to-transparent skew-x-12 z-0" />

                    <div className="relative z-10 flex flex-col items-center">
                        <span className="font-heading text-4xl font-extrabold text-charcoal tracking-tight drop-shadow-sm">12% OFF</span>
                        <span className="font-heading text-xl font-bold text-brown drop-shadow-sm">for New Customers</span>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#20bd5a] opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#20bd5a]" />
                            </span>
                            <span className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Limited-time offer</span>
                        </div>
                    </div>
                </div>
                {/* Secondary: scroll to portfolio */}
                <div className="hero-fade-in mt-4 opacity-0">
                    <a
                        href="#portfolio"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
                    >
                        View Before &amp; After Work
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 13l5 5 5-5" />
                            <path d="M7 6l5 5 5-5" />
                        </svg>
                    </a>
                </div>

                {/* Contact Line */}
                <div className="hero-fade-in mt-8 flex flex-col items-center gap-2 opacity-0 sm:flex-row sm:justify-center sm:gap-4">
                    <a
                        href={getCallUrl()}
                        className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Call/Text: {siteConfig.phoneDisplay}
                    </a>
                    <span className="hidden text-white/20 sm:inline">•</span>
                    <a
                        href={getEmailUrl()}
                        className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        {siteConfig.primaryEmail}
                    </a>
                </div>

                {/* Scroll indicator */}
                <div className="hero-fade-in absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0">
                    <div className="flex flex-col items-center gap-2 text-white/30">
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <div className="h-8 w-px animate-pulse bg-brown/40" />
                    </div>
                </div>
            </div>
        </section>
    );
}
