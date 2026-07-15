"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { siteConfig, getCallUrl, getEmailUrl } from "@/config/siteConfig";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled
                ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
                : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <a href="#hero" className="flex items-center">
                    <div className={`transition-all duration-300 rounded-xl flex items-center justify-center ${scrolled ? "bg-transparent py-1" : "bg-white/80 backdrop-blur-md shadow-sm border border-white/50 px-3 py-2"
                        }`}>
                        <Image
                            src="/logo/dg-logo.png"
                            alt={siteConfig.companyName}
                            width={160}
                            height={80}
                            className="h-10 w-auto sm:h-12 transition-all duration-300"
                            priority
                        />
                    </div>
                </a>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3">
                    {siteConfig.primaryEmail && (
                        <a
                            href={getEmailUrl()}
                            className="hidden items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-charcoal-light hover:scale-105 sm:inline-flex"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            Email Us for a Quote
                        </a>
                    )}
                    <a
                        href={getCallUrl()}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 ${scrolled
                            ? "bg-brown text-white hover:bg-brown-light"
                            : "bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Call Now
                    </a>
                </div>
            </div>
        </header>
    );
}
