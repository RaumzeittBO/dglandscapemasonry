"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";

const navItems = [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#portfolio" },
    { label: "Reviews", href: "#reviews" },
    { label: "Areas", href: "#service-areas" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
            <div
                className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 ${
                    scrolled
                        ? "border-charcoal/10 bg-white/92 shadow-[0_18px_60px_rgba(20,28,22,0.14)] backdrop-blur-xl"
                        : "border-white/18 bg-charcoal/22 text-white backdrop-blur-md"
                }`}
            >
                <a href="#hero" className="flex items-center gap-3" aria-label="Go to home">
                    <span
                        className={`flex h-11 w-24 items-center justify-center rounded-full transition-colors sm:h-12 sm:w-28 ${
                            scrolled ? "bg-mist" : "bg-white/88"
                        }`}
                    >
                        <Image
                            src="/logo/dg-logo.png"
                            alt={siteConfig.companyName}
                            width={132}
                            height={64}
                            className="h-9 w-auto object-contain sm:h-10"
                            priority
                        />
                    </span>
                    <span className="hidden text-left sm:block">
                        <span className={`block text-[11px] font-semibold uppercase tracking-[0.18em] ${scrolled ? "text-moss" : "text-white/78"}`}>
                            Landscape & Masonry
                        </span>
                        <span className={`block text-sm font-semibold ${scrolled ? "text-charcoal" : "text-white"}`}>
                            Massachusetts
                        </span>
                    </span>
                </a>

                <nav className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                scrolled
                                    ? "text-charcoal/70 hover:bg-mist hover:text-charcoal"
                                    : "text-white/72 hover:bg-white/12 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {siteConfig.primaryEmail && (
                        <a
                            href={getEmailUrl()}
                            onClick={reportConversion}
                            className="hidden rounded-full bg-gold px-4 py-2.5 text-sm font-black text-ink shadow-[0_12px_30px_rgba(210,185,128,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white md:inline-flex"
                        >
                            Email Quote
                        </a>
                    )}
                    <a
                        href={getCallUrl()}
                        onClick={reportConversion}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                            scrolled
                                ? "bg-moss text-white shadow-[0_12px_30px_rgba(38,74,55,0.18)] hover:bg-forest"
                                : "bg-white/12 text-white hover:bg-white/20"
                        }`}
                    >
                        <span className="hidden sm:inline">Call/Text</span>
                        <span>{siteConfig.phoneDisplay}</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
