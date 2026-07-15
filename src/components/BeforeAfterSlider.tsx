"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
    beforeSrc: string;
    afterSrc: string;
    beforeAlt?: string;
    afterAlt?: string;
}

export default function BeforeAfterSlider({
    beforeSrc,
    afterSrc,
    beforeAlt = "Before",
    afterAlt = "After",
}: BeforeAfterSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const updatePosition = useCallback(
        (clientX: number) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPos(percentage);
        },
        []
    );

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            setIsDragging(true);
            updatePosition(e.clientX);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        },
        [updatePosition]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging) return;
            updatePosition(e.clientX);
        },
        [isDragging, updatePosition]
    );

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div
            ref={containerRef}
            className="before-after-slider group relative aspect-[4/3] w-full overflow-hidden rounded-xl"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            role="slider"
            aria-label="Before and after comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPos)}
        >
            {/* After Image (full width, behind) */}
            <div className="absolute inset-0">
                <Image
                    src={afterSrc}
                    alt={afterAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                />
            </div>

            {/* Before Image (clipped) */}
            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <Image
                    src={beforeSrc}
                    alt={beforeAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                />
            </div>

            {/* Slider Line */}
            <div
                className="absolute top-0 bottom-0 z-10 w-0.5 bg-brown shadow-lg"
                style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
                {/* Handle */}
                <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brown bg-charcoal/80 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-brown-light"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M8 3l-5 9 5 9" />
                        <path d="M16 3l5 9-5 9" />
                    </svg>
                </div>
            </div>

            {/* Labels */}
            <span className="absolute left-3 top-3 z-10 rounded-full bg-charcoal/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                Before
            </span>
            <span className="absolute right-3 top-3 z-10 rounded-full bg-brown/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                After
            </span>
        </div>
    );
}
