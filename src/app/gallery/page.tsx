"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryImages } from "@/data/galleryImages";
import Navbar from "@/components/Navbar";
import FinalCTA from "@/components/FinalCTA";
import AnimationProvider from "@/components/AnimationProvider";

export default function GalleryPage() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
        }
    };

    const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex(
                (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
            );
        }
    };

    return (
        <AnimationProvider>
            <Navbar />

            <main className="min-h-screen bg-offwhite pt-32 pb-24">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-brown hover:text-brown-light transition-colors mb-4"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                            Back Home
                        </Link>
                        <h1 className="font-heading text-4xl font-bold text-charcoal sm:text-5xl md:text-6xl">
                            Photo Gallery
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral">
                            Explore our latest landscape and masonry transformations.
                        </p>
                        <div className="mx-auto mt-8 h-px w-16 bg-brown" />
                    </div>

                    {/* Masonry Grid */}
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {galleryImages.map((image, idx) => (
                            <div
                                key={idx}
                                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl bg-charcoal-light shadow-sm"
                                onClick={() => openLightbox(idx)}
                            >
                                {/* We don't have exact heights for placeholders so we use an aspect ratio wrapper. For real images, Next.js Image with intrinsic sizing works elegantly in Columns layout but requires width/height. We'll use aspect-auto but provide realistic placeholder dimensions */}
                                <div className="relative w-full" style={{ aspectRatio: idx % 3 === 0 ? "4/5" : idx % 2 === 0 ? "16/9" : "1/1" }}>
                                    {/* Real Next.js image with 'fill' handles masonry well if parent has aspect ratio or if intrinsic sizes are known */}
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {/* Placeholder overlay if image not found (since we use dummy paths) */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-charcoal-light/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="text-center p-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                            </svg>
                                            <span className="text-white font-medium text-sm">View Full Size</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <FinalCTA />

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        className="absolute right-6 top-6 z-50 text-white/50 hover:text-white transition-colors p-2"
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation Prev */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white transition-colors p-4"
                        onClick={showPrev}
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Main Image */}
                    <div className="relative w-full max-w-6xl h-[80vh] px-16 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full h-full">
                            <Image
                                src={galleryImages[lightboxIndex].src}
                                alt={galleryImages[lightboxIndex].alt}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>
                    </div>

                    {/* Image Counter & Caption */}
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                        <p className="text-white/80 text-lg font-medium mb-1 drop-shadow-md">
                            {galleryImages[lightboxIndex].alt}
                        </p>
                        <p className="text-white/50 text-sm">
                            {lightboxIndex + 1} / {galleryImages.length}
                        </p>
                    </div>

                    {/* Navigation Next */}
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white transition-colors p-4"
                        onClick={showNext}
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </AnimationProvider>
    );
}
