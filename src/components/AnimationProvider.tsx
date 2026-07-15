"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface AnimationProviderProps {
    children: ReactNode;
}

export default function AnimationProvider({ children }: AnimationProviderProps) {
    const lenisRef = useRef<{ destroy: () => void } | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Only initialize Lenis on desktop and if user hasn't requested reduced motion
        const isDesktop = window.innerWidth >= 768;

        if (prefersReducedMotion || !isDesktop) return;

        let animationId: number;

        const initLenis = async () => {
            try {
                const Lenis = (await import("@studio-freight/lenis")).default;
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                });

                lenisRef.current = lenis;

                function raf(time: number) {
                    lenis.raf(time);
                    animationId = requestAnimationFrame(raf);
                }

                animationId = requestAnimationFrame(raf);
            } catch {
                // Lenis not available, smooth scroll will not be applied
            }
        };

        initLenis();

        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return <>{children}</>;
}
