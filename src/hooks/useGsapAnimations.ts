"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function useScrollReveal(
    selector: string = ".reveal-element",
    options?: {
        stagger?: number;
        y?: number;
        duration?: number;
        start?: string;
    }
) {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(selector, { opacity: 1, y: 0 });
            return;
        }

        hasRun.current = true;

        const ctx = gsap.context(() => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
                gsap.fromTo(
                    el,
                    {
                        opacity: 0,
                        y: options?.y ?? 30,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: options?.duration ?? 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: options?.start ?? "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        });

        return () => {
            ctx.revert();
            hasRun.current = false;
        };
    }, [selector, options]);
}

export function useStaggerReveal(
    containerSelector: string,
    childSelector: string,
    options?: {
        stagger?: number;
        y?: number;
        duration?: number;
    }
) {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(childSelector, { opacity: 1, y: 0 });
            return;
        }

        const ctx = gsap.context(() => {
            const containers = document.querySelectorAll(containerSelector);
            containers.forEach((container) => {
                const children = container.querySelectorAll(childSelector);
                gsap.fromTo(
                    children,
                    {
                        opacity: 0,
                        y: options?.y ?? 40,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: options?.duration ?? 0.7,
                        stagger: options?.stagger ?? 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: container,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        });

        return () => ctx.revert();
    }, [containerSelector, childSelector, options]);
}

export function useHeroTextReveal(selector: string) {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(selector, { opacity: 1 });
            return;
        }

        let splitInstance: { revert: () => void } | null = null;

        const initAnimation = async () => {
            try {
                const SplitType = (await import("split-type")).default;
                const el = document.querySelector(selector);
                if (!el) return;

                splitInstance = new SplitType(el as HTMLElement, {
                    types: "words",
                    tagName: "span",
                });

                const words = (el as HTMLElement).querySelectorAll(".word");

                gsap.set(el, { opacity: 1 });

                gsap.fromTo(
                    words,
                    {
                        opacity: 0,
                        y: 40,
                        rotateX: -30,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        duration: 1,
                        stagger: 0.06,
                        ease: "power4.out",
                        delay: 0.3,
                    }
                );
            } catch {
                // Fallback: just show the text
                gsap.set(selector, { opacity: 1 });
            }
        };

        initAnimation();

        return () => {
            if (splitInstance) {
                splitInstance.revert();
            }
        };
    }, [selector]);
}
