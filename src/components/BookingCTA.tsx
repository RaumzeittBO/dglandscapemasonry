"use client";

import { useScrollReveal } from "@/hooks/useGsapAnimations";
import { siteConfig, getCallUrl, getEstimateFormUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";

export default function BookingCTA() {
    useScrollReveal(".reveal-booking");

    return (
        <section className="bg-mist px-6 py-24 sm:py-32">
            <div className="reveal-booking mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-ink text-white shadow-[0_35px_120px_rgba(12,18,14,0.22)]">
                <div className="grid lg:grid-cols-[1fr_0.72fr]">
                    <div className="p-8 sm:p-12 lg:p-16">
                        <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gold">
                            Schedule an estimate
                        </span>
                        <h2 className="mt-6 max-w-3xl font-heading text-5xl font-bold leading-[0.98] sm:text-6xl">
                            Tell us what you want changed. We will bring the plan.
                        </h2>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                            Send a quick description of the project. D&G will help you turn it into a clear scope, realistic quote, and a property upgrade that feels worth it.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={getEstimateFormUrl()}
                                className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-4 text-base font-black text-ink transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                            >
                                Request an estimate
                            </a>
                            <a
                                href={getCallUrl()}
                                onClick={reportConversion}
                                className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/18"
                            >
                                Call/Text {siteConfig.phoneDisplay}
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-white/10 bg-white/[0.06] p-8 sm:p-12 lg:border-l lg:border-t-0">
                        <div className="grid h-full content-center gap-4">
                            {[
                                ["01", "Fast response"],
                                ["02", "On-site estimate"],
                                ["03", "Clean, crew-led execution"],
                            ].map(([number, label]) => (
                                <div key={number} className="rounded-3xl border border-white/12 bg-white/8 p-5">
                                    <div className="text-sm font-black text-gold">{number}</div>
                                    <div className="mt-2 font-heading text-2xl font-bold">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
