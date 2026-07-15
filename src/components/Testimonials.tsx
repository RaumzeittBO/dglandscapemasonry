"use client";

import { useState } from "react";
import { siteConfig } from "@/config/siteConfig";

const featuredReviews = [
    {
        name: "Anne Logan",
        time: "a year ago",
        rating: 5,
        text: "Elmer and his crew are very professional and knowledgeable about lawn and garden care. He divided some overgrown bushes and helped me pick the right spots for them along with spring and fall clean up. He replaced a broken gate for me so my dogs couldn’t escape!! He put in a patio and redid my walkways efficiently and skillfully. His crew is friendly but efficient making sure my yard looks perfect. He also does snow removal for me. I highly recommend D&G Landscaping and Masonry.",
    },
    {
        name: "Christine H. Chen",
        time: "7 months ago",
        rating: 5,
        text: "Great job on backyard cleaning. Reliable and timely. Appreciate them and I would recommend them!",
    },
];

const additionalReviews = [
    {
        name: "William Stevens",
        time: "8 months ago",
        rating: 5,
        text: "Reasonable prices and great people. Definitely will continue to do business with them. Only gripe is that they don’t have any online presence.",
    },
    {
        name: "Niky Cabrera",
        time: "5 years ago",
        rating: 5,
        text: "D&G Landscape masonry inc, they are very professional, punctual, kind, they gave me a very good price, when they finished the job I was impressed; I think I will hire them again in the future. thanks.",
    },
];

type Review = {
    name: string;
    time: string;
    rating: number;
    text: string;
};

function ReviewCard({ review }: { review: Review }) {
    const [expanded, setExpanded] = useState(false);
    const textLimit = 150;
    const needsExpansion = review.text.length > textLimit;

    return (
        <div className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white uppercase">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-semibold text-charcoal text-[15px] leading-tight">{review.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbc04" className="h-4 w-4">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-neutral-light">{review.time}</span>
                    </div>
                </div>
            </div>
            <p className="text-sm text-neutral mt-1">
                {expanded || !needsExpansion
                    ? review.text
                    : `${review.text.substring(0, textLimit)}...`}
                {needsExpansion && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="ml-1 text-sm font-medium text-neutral-light hover:underline"
                    >
                        {expanded ? "Read less" : "Read more"}
                    </button>
                )}
            </p>
        </div>
    );
}

export default function Testimonials() {
    return (
        <section id="reviews" className="bg-offwhite py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="reveal-element mb-12 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-brown">
                        Testimonials
                    </span>
                    <h2 className="font-heading text-4xl font-bold text-charcoal sm:text-5xl">
                        Google Reviews
                    </h2>
                    <div className="mx-auto mt-4 h-px w-16 bg-brown" />
                    <p className="mt-4 text-base text-neutral">
                        Real reviews from our Google customers.
                    </p>

                    {/* Overall Summary */}
                    <div className="mt-6 inline-flex flex-col items-center justify-center rounded-2xl bg-white px-8 py-5 shadow-sm border border-border">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-bold text-charcoal">5.0</span>
                            <div className="flex flex-col items-start gap-1">
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbc04" className="h-5 w-5">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-neutral font-medium">4 Reviews on Google</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 reveal-element">
                    {/* Featured Reviews */}
                    <div className="flex flex-col gap-4">
                        <div className="mb-2">
                            <span className="text-sm font-bold uppercase tracking-wider text-brown">
                                Featured Google Reviews
                            </span>
                        </div>
                        {featuredReviews.map((review, i) => (
                            <ReviewCard key={`featured-${i}`} review={review} />
                        ))}
                    </div>

                    {/* Additional Reviews */}
                    <div className="flex flex-col gap-4">
                        <div className="mb-2 hidden md:block">
                            <span className="text-sm font-bold uppercase tracking-wider text-transparent select-none">
                                Spacer
                            </span>
                        </div>
                        {additionalReviews.map((review, i) => (
                            <ReviewCard key={`additional-${i}`} review={review} />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center reveal-element">
                    <a
                        href={siteConfig.googleReviewsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-brown px-8 py-3.5 font-semibold text-brown transition-all duration-300 hover:bg-brown hover:text-white hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                        </svg>
                        Read More Reviews on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
