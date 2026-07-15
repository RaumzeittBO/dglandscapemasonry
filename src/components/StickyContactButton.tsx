"use client";

import { useState } from "react";
import { siteConfig, getCallUrl, getSmsUrl, getEmailUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";

export default function StickyContactButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Expanded Options */}
            <div
                className={`flex flex-col gap-2 transition-all duration-300 ${isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
            >
                {/* Call Button */}
                <a
                    href={getCallUrl()}
                    onClick={reportConversion}
                    className="flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-charcoal-light hover:shadow-xl hover:scale-105"
                    aria-label={`Call ${siteConfig.phoneDisplay}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>Call</span>
                </a>

                {/* SMS Button */}
                <a
                    href={getSmsUrl()}
                    onClick={reportConversion}
                    className="flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-charcoal-light hover:shadow-xl hover:scale-105"
                    aria-label={`Text ${siteConfig.phoneDisplay}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>Text</span>
                </a>
            </div>

            {/* Main Email FAB (Primary) flexed conditionally */}
            {siteConfig.primaryEmail && (
                <a
                    href={getEmailUrl()}
                    onClick={reportConversion}
                    className="group flex items-center gap-2 rounded-full bg-charcoal px-5 py-3.5 font-medium text-white shadow-lg transition-all duration-300 hover:bg-charcoal-light hover:shadow-xl hover:scale-105"
                    aria-label="Email us"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="hidden sm:inline">Email Us</span>
                </a>
            )}

            {/* Toggle for Call/Text/Email options */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/80 text-white shadow-md transition-all duration-300 hover:bg-charcoal ${isOpen ? "rotate-45" : ""
                    }`}
                aria-label={isOpen ? "Close contact options" : "More contact options"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}
