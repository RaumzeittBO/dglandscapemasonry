"use client";

import { siteConfig, getCallUrl, getEstimateFormUrl } from "@/config/siteConfig";
import { reportConversion } from "@/utils/conversion";
import { useStaggerReveal } from "@/hooks/useGsapAnimations";

export default function ServiceAreas() {
    useStaggerReveal("#areas-grid", ".area-item");

    return (
        <section id="service-areas" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="reveal-element mb-14 text-center">
                    <span className="mb-5 inline-flex rounded-full bg-mist px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-moss">
                        Coverage
                    </span>
                    <h2 className="font-heading text-5xl font-bold leading-[0.98] text-charcoal sm:text-6xl">
                        Service areas
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-charcoal/62">
                        D&G serves selected Massachusetts communities. Send your city and photos, and we will confirm availability quickly.
                    </p>
                </div>

                <div id="areas-grid" className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {siteConfig.serviceAreas.map((area) => (
                        <div
                            key={area}
                            className="area-item flex items-center gap-2 rounded-2xl border border-charcoal/8 bg-mist p-4 text-sm font-bold text-charcoal shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-moss/20 hover:bg-white hover:shadow-md"
                        >
                            <span className="h-2 w-2 shrink-0 rounded-full bg-sage" />
                            {area}
                        </div>
                    ))}
                </div>

                <div className="reveal-element mt-12 rounded-[1.5rem] border border-charcoal/8 bg-mist p-8 text-center shadow-sm">
                    <p className="text-charcoal/68">
                        Not listed? Email us your city and project photos. We may still serve your area.
                    </p>
                    <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <a
                            href={getEstimateFormUrl()}
                            className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-forest hover:shadow-lg"
                        >
                            Request a free estimate
                        </a>
                        <a
                            href={getCallUrl()}
                            onClick={reportConversion}
                            className="inline-flex items-center gap-2 rounded-full border border-moss/20 px-6 py-3 text-sm font-bold text-moss transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                        >
                            Call / Text
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
